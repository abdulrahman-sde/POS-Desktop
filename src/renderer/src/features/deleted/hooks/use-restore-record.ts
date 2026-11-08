import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { categoryKeys } from '@/features/categories/api/categories.keys'
import { customerKeys } from '@/features/customers/api/customers.keys'
import { productKeys } from '@/features/products/api/products.keys'
import { supplierKeys } from '@/features/suppliers/api/suppliers.keys'
import { useApiMutation } from '@/lib/use-api'
import { deletedApi } from '../api/deleted.api'
import { deletedKeys } from '../api/deleted.keys'
import type { RestoreVariables } from '../types'

const keysByKind = {
  product: productKeys.all,
  customer: customerKeys.all,
  supplier: supplierKeys.all,
  category: categoryKeys.all
}

export function useRestoreRecord() {
  const queryClient = useQueryClient()
  return useApiMutation(({ kind, id }: RestoreVariables) => deletedApi.restore({ kind, id }), {
    onSuccess: (_data, { kind, name }) => {
      queryClient.invalidateQueries({ queryKey: deletedKeys.all })
      queryClient.invalidateQueries({ queryKey: keysByKind[kind] })
      toast.success(`${name} brought back`)
    }
  })
}
