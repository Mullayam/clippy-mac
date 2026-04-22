# ClipMac

A lightweight, native clipboard history manager that lives in your menu bar. ClipMac automatically tracks everything you copy — text and images — and lets you instantly recall and reuse any previous clipboard item.

## What it does

- **Monitors your clipboard** in real-time, saving every text snippet and image you copy (up to 50 items, stored locally in IndexedDB).
- **Global shortcut `⌘⇧V`** opens a floating overlay on your current screen — even over full-screen apps — without switching desktops or Spaces.
- **One-click paste** — click any item to copy it back to your clipboard and auto-dismiss the window.
- **Search** — instantly filter your clipboard history with real-time text search.
- **Keyboard-driven** — navigate with arrow keys, press Enter to copy, Escape to dismiss.
- **Image support** — copies images with inline thumbnail previews.
- **Auto dark/light theme** — follows your macOS system appearance with translucent vibrancy.
- **System tray icon** for quick access via menu bar.
- **Starts on login** silently in the background — always ready when you need it.
- **Privacy-first** — all data is stored locally on your machine, nothing leaves your device.

## Key Features

| Feature | Detail |
|---|---|
| Clipboard tracking | Text + images, polled every 1s |
| Storage | Local IndexedDB, max 50 items, auto-prune |
| Global shortcut | `⌘⇧V` to toggle |
| Keyboard nav | ↑↓ to browse, Enter to copy, Esc to close |
| Search | Real-time filtering, auto-focused |
| Theming | Auto dark/light matching macOS |
| Window behavior | Overlay panel on all Spaces, hides on blur |
| Auto-start | Launches on login, hidden |
| Deduplication | Same content updates timestamp, no duplicates |

## Tech Stack

- **Electron** + **React** + **TypeScript**
- **Tailwind CSS** for styling
- **Dexie** (IndexedDB) for local storage
- **electron-vite** for build tooling

## Project Setup

### Install

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

```bash
# For macOS
pnpm build:mac

# For Windows
pnpm build:win

# For Linux
pnpm build:linux
```
