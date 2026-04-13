import { clipboard, BrowserWindow } from 'electron';

let lastText = '';
let lastImage = '';
let skipNext = false;

export const suppressNextPoll = (): void => {
  skipNext = true;
};

export const startClipboardPolling = (win: BrowserWindow): void => {
  setInterval(() => {
    if (skipNext) {
      // Update last known values so we don't re-detect the self-copy
      lastText = clipboard.readText();
      const img = clipboard.readImage();
      if (!img.isEmpty()) {
        lastImage = img.toDataURL();
      }
      skipNext = false;
      return;
    }

    const text = clipboard.readText();
    const image = clipboard.readImage();

    // Check for new text
    if (text && text !== lastText) {
      lastText = text;
      win.webContents.send('clipboard-update', [
        { type: 'text', content: text, time: Date.now() },
      ]);
      return;
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
    }
  }, 1000);
};
