import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { categoryKeys } from '@/features/categories/api/categories.keys'
import { productKeys } from '@/features/products/api/products.keys'
import { useSuppliers } from '@/features/suppliers/hooks/use-suppliers'
import { formatCurrency } from '@/lib/format'
import { useApiMutation } from '@/lib/use-api'
import { purchasesApi } from '../api/purchases.api'
import { purchaseKeys, supplierPaymentKeys } from '../api/purchases.keys'

export function useCreatePurchase() {
  const queryClient = useQueryClient()
  return useApiMutation(purchasesApi.create, {
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: purchaseKeys.all }),
        queryClient.invalidateQueries({ queryKey: productKeys.all }),
        queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      ])
  })
}

export function usePaySupplier() {
  const queryClient = useQueryClient()
  const { allSuppliers } = useSuppliers()
  return useApiMutation(purchasesApi.paySupplier, {
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: supplierPaymentKeys.all })
      const name = allSuppliers.find((s) => s.id === payment.supplierId)?.name ?? 'the supplier'
      toast.success(`${formatCurrency(payment.amount)} paid to ${name}`)
    }
  })
}
