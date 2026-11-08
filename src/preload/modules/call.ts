import { ipcRenderer } from 'electron'

import type { ApiResult } from '@shared/result'

// Sends one request to a backend route (the ipcMain.handle with the same channel name in
// src/main/modules) and gives back its answer. Every preload module uses this.
export const call = <T>(channel: string, input?: unknown): Promise<ApiResult<T>> =>
  ipcRenderer.invoke(channel, input)
