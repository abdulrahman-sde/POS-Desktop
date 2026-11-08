import { useQueryClient } from '@tanstack/react-query'

import { productKeys } from '@/features/products/api/products.keys'
import { useApiMutation } from '@/lib/use-api'
import { salesApi } from '../api/sales.api'
import { orderKeys } from '../api/sales.keys'

export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useApiMutation(salesApi.createOrder, {
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: orderKeys.all }),
        queryClient.invalidateQueries({ queryKey: productKeys.all })
      ])
  })
}
