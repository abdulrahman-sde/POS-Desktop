import { useState } from 'react'
import { toast } from 'sonner'

import { saveSettingsSchema } from '@shared/settings/schema'
import type { ShopSettings, ShopSettingsErrors, ShopSettingsFormProps } from '../types'
import { useSaveSettings } from './use-settings-mutations'

export function useSettingsForm({ settings }: ShopSettingsFormProps) {
  const saveSettings = useSaveSettings()
  const [form, setForm] = useState<ShopSettings>(settings)
  const [errors, setErrors] = useState<ShopSettingsErrors>({})

  const set =
    (key: keyof ShopSettings) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }))
      setErrors((prev) => ({ ...prev, [key]: '' }))
    }

  const submit = async (): Promise<void> => {
    const checked = saveSettingsSchema.safeParse(form)
    if (!checked.success) {
      const next: ShopSettingsErrors = {}
      for (const issue of checked.error.issues) next[String(issue.path[0])] ??= issue.message
      setErrors(next)
      return
    }

    try {
      await saveSettings.mutateAsync(checked.data)
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  return { form, errors, saving: saveSettings.isPending, set, submit }
}
