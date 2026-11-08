import type { DeletedRecords, RestoreInput } from '@shared/deleted/types'
import { call } from './call'

export const deletedPreload = {
  list: () => call<DeletedRecords>('deleted:list'),
  restore: (input: RestoreInput) => call<void>('deleted:restore', input)
}
