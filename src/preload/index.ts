import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('clipboardAPI', {
      onUpdate: (callback: (data: any[]) => void) => {
        const handler = (_: any, data: any[]): void => callback(data)
        ipcRenderer.on('clipboard-update', handler)
        return (): void => {
          ipcRenderer.removeListener('clipboard-update', handler)
        }
      },
      onThemeChange: (callback: (theme: 'dark' | 'light') => void) => {
        const handler = (_: any, theme: 'dark' | 'light'): void => callback(theme)
        ipcRenderer.on('theme-changed', handler)
        return (): void => {
          ipcRenderer.removeListener('theme-changed', handler)
        }
      },
      copyToClipboard: (text: string) => ipcRenderer.send('copy-to-clipboard', text),
      copyAndHide: (text: string) => ipcRenderer.send('copy-and-hide', text),
      minimize: () => ipcRenderer.send('minimize-window'),
      close: () => ipcRenderer.send('close-window'),
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
