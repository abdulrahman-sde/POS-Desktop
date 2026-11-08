import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useApiMutation } from '@/lib/use-api'
import { settingsApi } from '../api/settings.api'
import { settingsKeys } from '../api/settings.keys'

export function useSaveSettings() {
  const queryClient = useQueryClient()
  return useApiMutation(settingsApi.save, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all })
      toast.success('Settings saved')
    }
  })
}
