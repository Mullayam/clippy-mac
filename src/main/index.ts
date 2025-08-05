import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu,
  globalShortcut,
  nativeImage
} from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { startClipboardPolling } from './clipboard-api'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isWindowVisible = false
const icon = path.join(__dirname, '../../resources/clipboard16.png')
const iconHD = path.join(__dirname, '../../resources/clipboard512.png')

function createTray() {
  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Clipboard',
      click: () => toggleWindow()
    },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ])

  tray.setToolTip('Clipboard Manager')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => toggleWindow())
}
function registerShortcut() {
  globalShortcut.register('CommandOrControl+Shift+V', () => {
    toggleWindow()
  })
}
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    show: false,
    autoHideMenuBar: true,
    frame: false,

    titleBarStyle: 'hiddenInset', // Optional: cleaner mac look
    icon: iconHD,
    title: 'Clip Mac',
    resizable: false,
    maximizable: false,
    minimizable: false,
    closable: false,
    darkTheme: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      devTools: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  ipcMain.on('minimize-window', () => {
    mainWindow?.minimize()
  })

  ipcMain.on('maximize-window', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow?.maximize()
    }
  })

  ipcMain.on('close-window', () => {
    mainWindow?.close()
  })
}
function toggleWindow() {
  if (!mainWindow) return

  if (isWindowVisible) {
    mainWindow.hide()
  } else {
    mainWindow.show()
    mainWindow.focus()
  }

  isWindowVisible = !isWindowVisible
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.mulayam.clipmac')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  createWindow()
  registerShortcut()
  createTray()
  app?.dock?.setIcon(nativeImage.createFromPath(iconHD))

  if (mainWindow) {
    startClipboardPolling(mainWindow) // 🔄 Start polling from earlier step
  }
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
