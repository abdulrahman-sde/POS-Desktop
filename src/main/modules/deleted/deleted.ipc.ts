import { restoreSchema } from '@shared/deleted/schema'
import { handle } from '../../lib/ipc'
import * as service from './deleted.service'

export function registerDeletedIpc(): void {
  handle('deleted:list', null, () => service.listDeleted())
  handle('deleted:restore', restoreSchema, (input) => service.restore(input))
}
