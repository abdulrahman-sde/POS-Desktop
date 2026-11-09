import type { AuthStatus, ChangePasswordInput, UnlockInput } from '@shared/auth/types'
import { call } from './call'

export const authPreload = {
  status: () => call<AuthStatus>('auth:status'),
  unlock: (input: UnlockInput) => call<AuthStatus>('auth:unlock', input),
  changePassword: (input: ChangePasswordInput) => call<null>('auth:changePassword', input)
}
