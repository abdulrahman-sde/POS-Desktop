import { app, BrowserWindow, dialog } from 'electron'
import { format } from 'date-fns'
import { join } from 'path'

import type { BackupResult } from '@shared/backup/types'
import { handle } from '../lib/ipc'
import { createBackup } from './backup.service'

export function registerBackupIpc(): void {
  handle('backup:create', null, async (): Promise<BackupResult> => {
    const options = {
      title: 'Save a copy of your data',
      defaultPath: join(
        app.getPath('documents'),
        `stockwise-backup-${format(new Date(), 'yyyy-MM-dd')}.db`
      ),
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
}
