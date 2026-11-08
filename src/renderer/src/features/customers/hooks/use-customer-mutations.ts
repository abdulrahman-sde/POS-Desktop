import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useApiMutation } from '@/lib/use-api'
import { customersApi } from '../api/customers.api'
import { customerKeys } from '../api/customers.keys'

export function useAddCustomer() {
  const queryClient = useQueryClient()
  return useApiMutation(customersApi.add, {
    onSuccess: (customer) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all })
      toast.success(`${customer.name} added`)
    }
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()
  return useApiMutation(customersApi.update, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all })
      toast.success('Customer updated')
    }
  })
}
