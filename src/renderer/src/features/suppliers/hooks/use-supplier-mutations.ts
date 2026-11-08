import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useApiMutation } from '@/lib/use-api'
import { deletedKeys } from '@/features/deleted/api/deleted.keys'
import { suppliersApi } from '../api/suppliers.api'
import { supplierKeys } from '../api/suppliers.keys'
import type { Supplier } from '../types'

export function useAddSupplier() {
  const queryClient = useQueryClient()
  return useApiMutation(suppliersApi.add, {
    onSuccess: (supplier) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all })
      toast.success(`${supplier.name} added`)
    }
  })
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient()
  return useApiMutation(suppliersApi.update, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all })
      toast.success('Supplier updated')
    }
  })
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient()
  return useApiMutation((supplier: Supplier) => suppliersApi.remove(supplier.id), {
    onSuccess: (_data, supplier) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all })
      queryClient.invalidateQueries({ queryKey: deletedKeys.all })
      toast.success(`${supplier.name} deleted`)
    }
  })
}
