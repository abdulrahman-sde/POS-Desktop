import { saveSettingsSchema } from '@shared/settings/schema'
import { handle } from '../../lib/ipc'
import * as service from './settings.service'

export function registerSettingsIpc(): void {
  handle('settings:get', null, () => service.getSettings())
  handle('settings:save', saveSettingsSchema, (input) => service.saveSettings(input))
}
