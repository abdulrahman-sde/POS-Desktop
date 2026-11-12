import { ipcRenderer } from 'electron'

import type { UpdateStatus } from '@shared/update/types'
import { call } from './call'

export const updatePreload = {
  status: () => call<UpdateStatus>('update:status'),
  install: () => call<null>('update:install'),
  // Called when a new version has finished downloading. Returns a function that stops listening.
  onReady: (callback: (version: string) => void): (() => void) => {
    const listener = (_event: unknown, version: string): void => callback(version)
    ipcRenderer.on('update:ready', listener)
    return () => ipcRenderer.removeListener('update:ready', listener)
  }
}
