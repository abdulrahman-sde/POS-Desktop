import type { BackupSummary } from '@shared/backup/types'
import type { ShopSettings } from '@shared/settings/types'

export type { ShopSettings }

export type SettingsResult = {
  settings: ShopSettings
  isLoading: boolean
}

export type ShopSettingsFormProps = {
  settings: ShopSettings
}

export type ShopSettingsFormFields = Record<keyof ShopSettings, string>

export type ShopSettingsErrors = Record<string, string>

export type RestoreBackupDialogProps = {
  summary: BackupSummary | null // the dialog is open while this is set
  onOpenChange: (open: boolean) => void
}
