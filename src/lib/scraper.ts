import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import proxyChain from 'proxy-chain';
import { v4 as uuidv4 } from 'uuid';
import pdf from 'html-pdf';
import { supabase } from './supabase';
import { useStore } from '../store';

// Initialize Puppeteer with Stealth plugin
puppeteer.use(StealthPlugin());

interface ScraperOptions {
  url: string;
  saveToSupabase?: boolean;
  exportJson?: boolean;
  exportPdf?: boolean;
  projectId: string;
}

interface ScrapedData {
  url: string;
  content: any;
  timestamp: string;
  metadata?: any;
}

export class WebScraper {
  private addAction: typeof useStore.getState().addAction;

  constructor() {
    const store = useStore.getState();
    this.addAction = store.addAction;
  }

  async scrape({
    url,
    saveToSupabase = true,
    exportJson = true,
    exportPdf = true,
    projectId,
  }: ScraperOptions): Promise<ScrapedData> {
    try {
      // Log start of scraping
      this.addAction({
        type: 'automation',
        content: `Starting web scraping for ${url}`,
        status: 'pending',
        projectId,
        details: { url },
      });

      // Setup proxy
      const proxyUrl = await proxyChain.anonymizeProxy('http://free-proxy-list.net/');
      
      // Launch browser
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', `--proxy-server=${proxyUrl}`],
      });

      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle0' });
      const htmlContent = await page.content();

      // Use Cheerio for parsing
      const loader = new CheerioWebBaseLoader(htmlContent);
      const documents = await loader.load();

      // Process the scraped data
      const scrapedData: ScrapedData = {
        url,
        content: documents,
        timestamp: new Date().toISOString(),
        metadata: {
          title: await page.title(),
          headers: await page.$$eval('h1, h2, h3', (headers) =>
            headers.map((h) => ({ text: h.textContent, tag: h.tagName.toLowerCase() }))
          ),
        },
      };

      // Save to Supabase if requested
      if (saveToSupabase) {
        await this.saveToSupabase(scrapedData, projectId);
      }

      // Export as JSON if requested
      if (exportJson) {
        const filename = `scraped_data_${uuidv4()}.json`;
        this.exportToJson(scrapedData, filename);
      }

      // Export as PDF if requested
      if (exportPdf) {
        const filename = `scraped_data_${uuidv4()}.pdf`;
        await this.exportToPdf(htmlContent, filename);
      }

      await browser.close();

      // Log successful completion
      this.addAction({
        type: 'automation',
        content: `Successfully scraped ${url}`,
        status: 'completed',
        projectId,
        details: {
          url,
          action: 'scrape',
          metadata: scrapedData.metadata,
        },
      });

      return scrapedData;
    } catch (error) {
      // Log error
      this.addAction({
        type: 'error',
        content: `Failed to scrape ${url}: ${error.message}`,
        status: 'failed',
        projectId,
        details: { url, error: error.message },
      });
      throw error;
    }
  }

  private async saveToSupabase(data: ScrapedData, projectId: string): Promise<void> {
    const { error } = await supabase.from('scraped_data').insert({
      project_id: projectId,
      url: data.url,
      content: data.content,
      metadata: data.metadata,
      timestamp: data.timestamp,
    });

    if (error) {
      throw new Error(`Failed to save to Supabase: ${error.message}`);
    }
  }

  private exportToJson(data: ScrapedData, filename: string): void {
    // In browser environment, trigger download
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  private exportToPdf(htmlContent: string, filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const options = {
        format: 'A4',
        border: '10mm',
      };

      pdf.create(htmlContent, options).toBuffer((err, buffer) => {
        if (err) {
          reject(err);
          return;
        }

        // In browser environment, trigger download
        const blob = new Blob([buffer], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        resolve();
      });
    });
  }
}