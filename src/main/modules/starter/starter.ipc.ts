import { BrowserWindow, dialog } from 'electron'
import { readFileSync, statSync } from 'node:fs'

import type { StarterChoice } from '@shared/starter/types'
import { handle, UserError } from '../../lib/ipc'
import * as service from './starter.service'

const MAX_FILE_BYTES = 5 * 1024 * 1024

export function registerStarterIpc(): void {
  handle('starter:status', null, () => service.getStatus())

  // Opens the file picker, checks the whole file, then adds everything or nothing.
  handle('starter:import', null, async (): Promise<StarterChoice> => {
    if (service.getStatus().imported) {
      throw new UserError('The starting data has already been imported.')
    }
    const options = {
      title: 'Choose the starting data file',
      filters: [{ name: 'Starting data', extensions: ['json'] }],
      properties: ['openFile' as const]
    }
    const window = BrowserWindow.getFocusedWindow()
    const picked = window
      ? await dialog.showOpenDialog(window, options)
      : await dialog.showOpenDialog(options)

    const path = picked.filePaths[0]
    if (picked.canceled || !path) return { chosen: false }
    if (statSync(path).size > MAX_FILE_BYTES) {
      throw new UserError('That is not a Stockwise starting data file.')
    }
    const file = service.parseStarterFile(readFileSync(path, 'utf8'))
    return { chosen: true, result: service.importStarterData(file) }
  })
}
