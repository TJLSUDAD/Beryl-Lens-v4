export interface BrowserConfig {
  commands: string[];
  args: string[];
}

export class BrowserLauncher {
  private browserConfigs: Record<string, BrowserConfig> = {
    chrome: {
      commands: ['chrome', 'google-chrome', 'chromium'],
      args: ['--start-maximized', '--disable-extensions']
    },
    firefox: {
      commands: ['firefox', 'firefox-esr'],
      args: ['--kiosk', '--private-window']
    },
    edge: {
      commands: ['msedge', 'microsoft-edge'],
      args: ['--start-maximized']
    },
    safari: {
      commands: ['safari'],
      args: ['-new-window']
    }
  };

  async launchBrowser(url: string): Promise<boolean> {
    try {
      // In browser environment, use window.open
      window.open(url, '_blank');
      return true;
    } catch (error) {
      console.error('Failed to launch browser:', error);
      return false;
    }
  }

  async emergencyLaunch(url: string): Promise<boolean> {
    try {
      // Create a temporary link and click it
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch (error) {
      console.error('Emergency launch failed:', error);
      return false;
    }
  }
}