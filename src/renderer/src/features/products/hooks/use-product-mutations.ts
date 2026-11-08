import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useApiMutation } from '@/lib/use-api'
import { productsApi } from '../api/products.api'
import { productKeys } from '../api/products.keys'

export function useAddProduct() {
  const queryClient = useQueryClient()
  return useApiMutation(productsApi.add, {
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      toast.success(`${product.name} added to inventory`)
    }
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useApiMutation(productsApi.update, {
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      toast.success(`${product.name} updated`)
    }
  })
}

export function useAddStock() {
  const queryClient = useQueryClient()
  return useApiMutation(productsApi.addStock, {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all })
  })
}
