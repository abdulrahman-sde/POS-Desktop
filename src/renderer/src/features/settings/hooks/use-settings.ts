import { DEFAULT_SETTINGS } from '@shared/settings/constants'
import { useApiQuery } from '@/lib/use-api'
import { settingsApi } from '../api/settings.api'
import { settingsKeys } from '../api/settings.keys'
import type { SettingsResult } from '../types'

export function useSettings(): SettingsResult {
  const query = useApiQuery(settingsKeys.all, settingsApi.get)
  return { settings: query.data ?? DEFAULT_SETTINGS, isLoading: query.isLoading }
}
