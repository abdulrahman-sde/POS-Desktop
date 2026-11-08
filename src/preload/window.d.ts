import { ElectronAPI } from '@electron-toolkit/preload'

import type { api } from './index'

declare global {
  interface Window {
    electron: ElectronAPI
    // Taken from the real object in index.ts, so the two can never disagree.
    api: typeof api
  }
}
