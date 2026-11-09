import type { ChangePasswordInput, UnlockInput } from '@shared/auth/types'

export const authApi = {
  status: () => window.api.auth.status(),
  unlock: (input: UnlockInput) => window.api.auth.unlock(input),
  changePassword: (input: ChangePasswordInput) => window.api.auth.changePassword(input)
}
