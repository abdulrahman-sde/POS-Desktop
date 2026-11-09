import type { z } from 'zod'

import type { changePasswordSchema, unlockSchema } from './schema'

export type UnlockInput = z.infer<typeof unlockSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

export type AuthStatus = {
  unlocked: boolean
  shopName: string
}
