import { app, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'

import { handle } from './lib/ipc'

// Remembered, so a screen that opens after the download finished (he was on the sign-in page) still hears about it.
let readyVersion: string | null = null

const CHECK_EVERY_MS = 4 * 60 * 60 * 1000 // every 4 hours while the app stays open

// Looks for a newer version on GitHub Releases (the address is in electron-builder.yml, "publish"), downloads it in
// the background and tells the screen when it is ready. The installer then replaces the app files only; the data
// folder is never touched.
export function startUpdater(): void {
  handle('update:status', null, () => ({ version: app.getVersion(), readyVersion }))

  // The "Restart to update" button on the screen.
  handle('update:install', null, () => {
    autoUpdater.quitAndInstall()
  })

  // While developing there is no installed app to update.
  if (!app.isPackaged) return

  autoUpdater.on('update-downloaded', (info) => {
    readyVersion = info.version
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send('update:ready', info.version)
    }
  })
  autoUpdater.on('error', (error) => console.error('[updater]', error))

  // No internet is not an error the owner needs to see.
  const check = (): void => {
    autoUpdater.checkForUpdates().catch((error) => console.error('[updater]', error))
  }
  check()
  setInterval(check, CHECK_EVERY_MS).unref()
}
