import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { StarterResult } from '@shared/starter/types'
import { plural } from '@/lib/format'
import { useApiMutation, useApiQuery } from '@/lib/use-api'
import { starterApi } from '../api/starter.api'
import { settingsKeys } from '../api/settings.keys'

export function useStarterStatus() {
  return useApiQuery(settingsKeys.starter, starterApi.status)
}

const summary = (result: StarterResult): string => {
  const parts = [
    result.customers > 0 && plural(result.customers, 'customer'),
    result.suppliers > 0 && plural(result.suppliers, 'supplier'),
    result.products > 0 && plural(result.products, 'product')
  ].filter(Boolean)
  const skipped = result.skipped > 0 ? ` (${result.skipped} already there)` : ''
  return `Added ${parts.join(', ')}${skipped}`
}

export function useImportStarterData() {
  const queryClient = useQueryClient()
  return useApiMutation(starterApi.import, {
    onSuccess: (choice) => {
      if (!choice.chosen) return
      // Customers, suppliers, products and categories all changed.
      queryClient.invalidateQueries()
      toast.success(summary(choice.result))
      if (choice.result.notOnWhatsApp.length > 0) {
        toast.warning(`No WhatsApp number: ${choice.result.notOnWhatsApp.join(', ')}`)
      }
    },
    onError: (error) => toast.error(error.message)
  })
}
