import { useMemo, useState } from 'react'

import { useCategories } from '@/features/categories/hooks/use-categories'
import { getStockLevel, type Product } from '../types'

export type StockFilter = 'all' | 'low' | 'out'

// Search text, category and stock filters for the products list.
export function useProductFilters(products: Product[], initialCategory = 'all') {
  const { categories: allCategories } = useCategories()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(initialCategory)
  const [stock, setStock] = useState<StockFilter>('all')

  const categories = allCategories.map((category) => category.name)

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase()
    return products.filter((product) => {
      if (category !== 'all' && product.category !== category) return false
      const level = getStockLevel(product)
      if (stock === 'low' && level !== 'low') return false
      if (stock === 'out' && level !== 'out') return false
      if (!text) return true
      return [product.name, product.itemCode, product.brand].some((value) =>
        value.toLowerCase().includes(text)
      )
    })
  }, [products, query, category, stock])

  return { query, setQuery, category, setCategory, stock, setStock, categories, filtered }
}
