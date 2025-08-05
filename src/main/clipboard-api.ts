import { clipboard, BrowserWindow } from 'electron';

let lastText = '';
let lastImage = '';

export const startClipboardPolling = (win: BrowserWindow) => {
  setInterval(() => {
    const text = clipboard.readText();
    const image = clipboard.readImage();

    // Check for new text
    if (text && text !== lastText) {
      lastText = text;
      win.webContents.send('clipboard-update', [
        { type: 'text', content: text, time: Date.now() },
      ]);
      return
    }

    // Check for new image
    if (!image.isEmpty()) {
      const dataUrl = image.toDataURL();
      if (dataUrl && dataUrl !== lastImage) {
        lastImage = dataUrl;
        win.webContents.send('clipboard-update', [
          { type: 'image', content: dataUrl, time: Date.now() },
        ]);
      }
      return

    }
  }, 1000);
};
