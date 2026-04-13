export {}

declare global {
  interface Window {
    clipboardAPI: {
      onUpdate: (callback: (data: any[]) => void) => () => void
      onThemeChange: (callback: (theme: 'dark' | 'light') => void) => () => void
      copyToClipboard: (text: string) => void
      copyAndHide: (text: string) => void
      minimize: () => void
      close: () => void
    }
  }
}
