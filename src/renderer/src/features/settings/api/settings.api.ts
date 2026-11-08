import type { SaveSettingsInput } from '@shared/settings/types'

export const settingsApi = {
  get: () => window.api.settings.get(),
  save: (input: SaveSettingsInput) => window.api.settings.save(input)
}
