import { changePasswordSchema, unlockSchema } from '@shared/auth/schema'
import { handle } from '../../lib/ipc'
import * as service from './auth.service'

export function registerAuthIpc(): void {
  handle('auth:status', null, () => service.getStatus())
  handle('auth:unlock', unlockSchema, (input) => service.unlock(input))
  handle('auth:changePassword', changePasswordSchema, (input) => service.changePassword(input))
}
