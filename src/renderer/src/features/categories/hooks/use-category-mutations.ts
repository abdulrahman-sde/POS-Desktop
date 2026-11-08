import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { productKeys } from '@/features/products/api/products.keys'
import { useApiMutation } from '@/lib/use-api'
import { categoriesApi } from '../api/categories.api'
import { categoryKeys } from '../api/categories.keys'
import type { Category } from '../types'

export function useAddCategory() {
  const queryClient = useQueryClient()
  return useApiMutation(categoriesApi.add, {
    onSuccess: (category) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      toast.success(`${category.name} added`)
    }
  })
}

export function useRenameCategory() {
  const queryClient = useQueryClient()
  return useApiMutation(categoriesApi.rename, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      // Products show their category's name, so they refresh too.
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      toast.success('Category renamed')
    }
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useApiMutation((category: Category) => categoriesApi.remove(category.id), {
    onSuccess: (_data, category) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      toast.success(`${category.name} deleted`)
    }
  })
}
