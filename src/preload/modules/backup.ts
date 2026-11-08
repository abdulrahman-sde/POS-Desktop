import type { BackupResult } from '@shared/backup/types'
import { call } from './call'

export const backupPreload = {
  create: () => call<BackupResult>('backup:create')
}
