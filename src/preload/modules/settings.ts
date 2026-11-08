import type { SaveSettingsInput, ShopSettings } from '@shared/settings/types'
import { call } from './call'

export const settingsPreload = {
  get: () => call<ShopSettings>('settings:get'),
  save: (input: SaveSettingsInput) => call<ShopSettings>('settings:save', input)
}
