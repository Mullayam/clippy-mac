import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu,
  globalShortcut,
  nativeImage,
  nativeTheme,
  clipboard
} from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { startClipboardPolling, suppressNextPoll } from './clipboard-api'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let blurTimeout: NodeJS.Timeout | null = null
let skipBlur = false

function getResourcePath(filename: string): string {
  if (is.dev) {
    return path.join(__dirname, '../../resources', filename)
  }
  return path.join(process.resourcesPath, 'resources', filename)
}

const getIcon = () => getResourcePath('clipboard16.png')
const getIconHD = () => getResourcePath('clipboard512.png')

function createTray(): void {
  tray = new Tray(getIcon())

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open Clipboard', click: () => toggleWindow() },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ])

  tray.setToolTip('Clipboard Manager')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => toggleWindow())
}

function registerShortcut(): void {
  globalShortcut.register('CommandOrControl+Shift+V', () => {
    toggleWindow()
  })
}

function registerIPC(): void {
  ipcMain.on('minimize-window', () => mainWindow?.hide())
  ipcMain.on('close-window', () => mainWindow?.hide())

  ipcMain.on('copy-to-clipboard', (_event: Electron.IpcMainEvent, text: string) => {
    suppressNextPoll()
    clipboard.writeText(text)
  })

  ipcMain.on('copy-and-hide', (_event: Electron.IpcMainEvent, text: string) => {
    suppressNextPoll()
    clipboard.writeText(text)
    mainWindow?.hide()
  })
}

function sendTheme(): void {
  const theme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
  mainWindow?.webContents.send('theme-changed', theme)
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 380,
    height: 520,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    icon: getIconHD(),
    title: 'Clipboard History',
    resizable: false,
    maximizable: false,
    minimizable: false,
    skipTaskbar: true,
    roundedCorners: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: is.dev
    }
  })

  mainWindow.on('ready-to-show', () => {
    sendTheme()
    mainWindow?.show()
  })

  mainWindow.on('blur', () => {
    if (skipBlur) {
      skipBlur = false
      return
    }
    if (blurTimeout) clearTimeout(blurTimeout)
    blurTimeout = setTimeout(() => {
      if (mainWindow && !mainWindow.isFocused()) {
        mainWindow.hide()
      }
    }, 150)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  nativeTheme.on('updated', () => sendTheme())

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function toggleWindow(): void {
  if (!mainWindow) return
  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    skipBlur = true
    mainWindow.show()
    mainWindow.focus()
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.mulayam.clipmac')

  // Auto-start on login
  app.setLoginItemSettings({ openAtLogin: true, openAsHidden: true })

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerIPC()
  createWindow()
  registerShortcut()
  createTray()
  app?.dock?.setIcon(nativeImage.createFromPath(getIconHD()))

  if (mainWindow) {
    startClipboardPolling(mainWindow)
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
