import { useState } from 'react'
import { toast } from 'sonner'

import { saveSettingsSchema } from '@shared/settings/schema'
import { toNumber } from '@/lib/format'
import type {
  ShopSettings,
  ShopSettingsErrors,
  ShopSettingsFormFields,
  ShopSettingsFormProps
} from '../types'
import { useSaveSettings } from './use-settings-mutations'

const toFields = (settings: ShopSettings): ShopSettingsFormFields => ({
  shopName: settings.shopName,
  ownerName: settings.ownerName,
  phone: settings.phone,
  address: settings.address,
  countryCode: settings.countryCode,
  invoiceNote: settings.invoiceNote,
  defaultReorderLevel: String(settings.defaultReorderLevel),
  defaultMarkupPercent: String(settings.defaultMarkupPercent)
})

export function useSettingsForm({ settings }: ShopSettingsFormProps) {
  const saveSettings = useSaveSettings()
  const [form, setForm] = useState<ShopSettingsFormFields>(toFields(settings))
  const [errors, setErrors] = useState<ShopSettingsErrors>({})

  const set =
    (key: keyof ShopSettings) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }))
      setErrors((prev) => ({ ...prev, [key]: '' }))
    }

  const submit = async (): Promise<void> => {
    const checked = saveSettingsSchema.safeParse({
      ...form,
      defaultReorderLevel:
        form.defaultReorderLevel.trim() === '' ? undefined : toNumber(form.defaultReorderLevel),
      defaultMarkupPercent:
        form.defaultMarkupPercent.trim() === '' ? undefined : toNumber(form.defaultMarkupPercent)
    })
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
