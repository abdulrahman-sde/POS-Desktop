import type { BackupChoice, BackupResult, RestoreResult } from '@shared/backup/types'
import { call } from './call'

export const backupPreload = {
  create: () => call<BackupResult>('backup:create'),
  choose: () => call<BackupChoice>('backup:choose'),
  restore: () => call<RestoreResult>('backup:restore')
}
