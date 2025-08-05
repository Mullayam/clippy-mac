import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'




// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('clipboardAPI', {
      getHistory: () => ipcRenderer.invoke('get-history'),
      onUpdate: (callback: (data: any[]) => void) => {
        ipcRenderer.on('clipboard-update', (_, data) => callback(data));
      },
      sendMessage: (event:string,text: string) => ipcRenderer.send(event, text),
      clearHistory: () => ipcRenderer.send('clear-history'),
      minimize: () => ipcRenderer.send('minimize-window'),
      maximize: () => ipcRenderer.send('maximize-window'),
      close: () => ipcRenderer.send('close-window'),
    });
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}



