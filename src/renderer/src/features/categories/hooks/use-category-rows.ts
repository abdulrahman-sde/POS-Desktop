import { useMemo } from 'react'

import { useProducts } from '@/features/products/hooks/use-products'
import type { CategoryRow } from '../types'
import { useCategories } from './use-categories'

export function useCategoryRows(): CategoryRow[] {
  const { categories } = useCategories()
  const { products } = useProducts()

  return useMemo(
    () =>
      categories.map((category) => {
        const own = products.filter((product) => product.category === category.name)
        return {
          category,
          productCount: own.length,
          stockValue: own.reduce((sum, product) => sum + product.stock * product.costPrice, 0)
        }
      }),
    [categories, products]
  )
}
