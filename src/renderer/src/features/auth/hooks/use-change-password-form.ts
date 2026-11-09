import { useState } from 'react'
import { toast } from 'sonner'

import { changePasswordSchema } from '@shared/auth/schema'
import { useApiMutation } from '@/lib/use-api'
import { authApi } from '../api/auth.api'
import type { ChangePasswordErrors, ChangePasswordFields, ChangePasswordFormResult } from '../types'

const EMPTY: ChangePasswordFields = { currentPassword: '', newPassword: '', confirmPassword: '' }

export function useChangePasswordForm(): ChangePasswordFormResult {
  const [form, setForm] = useState<ChangePasswordFields>(EMPTY)
  const [errors, setErrors] = useState<ChangePasswordErrors>({})

  const change = useApiMutation(authApi.changePassword, {
    onSuccess: () => {
      setForm(EMPTY)
      toast.success('Password changed. Use the new one next time you open the app.')
    },
    onError: (e) => setErrors({ currentPassword: e.message })
  })

  const set =
    (field: keyof ChangePasswordFields) =>
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setForm((f) => ({ ...f, [field]: event.target.value }))
      setErrors((e) => ({ ...e, [field]: undefined }))
    }

  const submit = (event: React.FormEvent): void => {
    event.preventDefault()
    const parsed = changePasswordSchema.safeParse(form)
    if (!parsed.success) {
      const next: ChangePasswordErrors = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof ChangePasswordFields
        next[field] ??= issue.message
      }
      setErrors(next)
      return
    }
    setErrors({})
    change.mutate(parsed.data)
  }

  return { form, errors, saving: change.isPending, set, submit }
}
