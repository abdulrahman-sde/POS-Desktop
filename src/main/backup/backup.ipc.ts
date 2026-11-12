import { app, BrowserWindow, dialog } from 'electron'
import { join } from 'path'

import type { BackupChoice, BackupResult, RestoreResult } from '@shared/backup/types'
import { handle } from '../lib/ipc'
import { createBackup, prepareRestore, restoreChosen } from './backup.service'

export function registerBackupIpc(): void {
  handle('backup:create', null, async (): Promise<BackupResult> => {
    const options = {
      title: 'Save a copy of your data',
      // The same name every time, so saving again offers to replace the last copy.
      defaultPath: join(app.getPath('documents'), 'stockwise-backup.db'),
      filters: [{ name: 'Stockwise backup', extensions: ['db'] }]
    }
    const window = BrowserWindow.getFocusedWindow()
    const chosen = window
      ? await dialog.showSaveDialog(window, options)
      : await dialog.showSaveDialog(options)

    if (chosen.canceled || !chosen.filePath) return { saved: false }
    await createBackup(chosen.filePath)
    return { saved: true, path: chosen.filePath }
  })

  // Step 1: pick a saved copy and check it. Nothing is replaced yet.
  handle('backup:choose', null, async (): Promise<BackupChoice> => {
    const options = {
      title: 'Choose a saved copy',
      defaultPath: app.getPath('documents'),
      filters: [{ name: 'Stockwise backup', extensions: ['db'] }],
      properties: ['openFile' as const]
    }
    const window = BrowserWindow.getFocusedWindow()
    const picked = window
      ? await dialog.showOpenDialog(window, options)
      : await dialog.showOpenDialog(options)

    const file = picked.filePaths[0]
    if (picked.canceled || !file) return { chosen: false }
    return { chosen: true, summary: prepareRestore(file) }
  })

  // Step 2, after the owner confirms. It takes no file name: it only uses the copy checked in step 1.
  handle('backup:restore', null, async (): Promise<RestoreResult> => {
    await restoreChosen()
    return { restored: true }
  })
}
