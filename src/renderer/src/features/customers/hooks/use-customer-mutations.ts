import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useApiMutation } from '@/lib/use-api'
import { deletedKeys } from '@/features/deleted/api/deleted.keys'
import { customersApi } from '../api/customers.api'
import { customerKeys } from '../api/customers.keys'
import type { Customer } from '../types'

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

export function useDeleteCustomer() {
  const queryClient = useQueryClient()
  return useApiMutation((customer: Customer) => customersApi.remove(customer.id), {
    onSuccess: (_data, customer) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all })
      queryClient.invalidateQueries({ queryKey: deletedKeys.all })
      toast.success(`${customer.name} deleted`)
    }
  })
}
