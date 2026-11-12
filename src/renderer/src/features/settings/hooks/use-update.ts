import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { useApiMutation, useApiQuery } from '@/lib/use-api'
import { settingsKeys } from '../api/settings.keys'
import { updateApi } from '../api/update.api'

// The running version, and a newer one that is downloaded and waiting for a restart (null when there is none).
export function useUpdateStatus() {
  const queryClient = useQueryClient()
  const query = useApiQuery(settingsKeys.update, updateApi.status)

  useEffect(
    () => updateApi.onReady(() => queryClient.invalidateQueries({ queryKey: settingsKeys.update })),
    [queryClient]
  )

  return { version: query.data?.version ?? '', readyVersion: query.data?.readyVersion ?? null }
}

export function useInstallUpdate() {
  return useApiMutation(updateApi.install, { onError: (error) => toast.error(error.message) })
}
