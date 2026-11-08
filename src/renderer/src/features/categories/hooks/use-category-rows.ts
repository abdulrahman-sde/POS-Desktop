import { useMemo } from 'react'

import { useData } from '@/app/providers/data-context'
import type { Category } from '../types'

export type CategoryRow = {
  category: Category
  productCount: number
  stockValue: number // what the items in this category cost you
}

export function useCategoryRows(): CategoryRow[] {
  const { categories, products } = useData()

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
