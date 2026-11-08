import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { deletedKeys } from '@/features/deleted/api/deleted.keys'
import { useApiMutation } from '@/lib/use-api'
import { productsApi } from '../api/products.api'
import { productKeys } from '../api/products.keys'
import type { Product } from '../types'

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

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useApiMutation((product: Product) => productsApi.remove(product.id), {
    onSuccess: (_data, product) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      queryClient.invalidateQueries({ queryKey: deletedKeys.all })
      toast.success(`${product.name} deleted`)
    }
  })
}
