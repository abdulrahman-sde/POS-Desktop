import type { ShopSettings } from '@shared/settings/types'

export type { ShopSettings }

export type SettingsResult = {
  settings: ShopSettings
  isLoading: boolean
}

export type ShopSettingsFormProps = {
  settings: ShopSettings
}

export type ShopSettingsErrors = Record<string, string>
