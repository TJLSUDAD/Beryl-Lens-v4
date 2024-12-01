/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_FLASH_API_KEY: string
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_GROQ_API_KEY: string
  readonly VITE_CLAUDE_API_KEY: string
  readonly VITE_GITHUB_ACCESS_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}