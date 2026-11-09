import { z } from 'zod'

export const MIN_PASSWORD_LENGTH = 6

export const unlockSchema = z.object({
  password: z.string().min(1, 'Enter the password.').max(200, 'The password is too long.')
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password.').max(200),
    newPassword: z
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        `The new password needs at least ${MIN_PASSWORD_LENGTH} characters.`
      )
      .max(200, 'The new password is too long.'),
    confirmPassword: z.string()
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'The two new passwords are not the same.'
  })
  .refine((v) => v.newPassword !== v.currentPassword, {
    path: ['newPassword'],
    message: 'The new password is the same as the current one.'
  })
