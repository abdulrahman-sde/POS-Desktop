import { useApiQuery } from '@/lib/use-api'
import { productsApi } from '../api/products.api'
import { productKeys } from '../api/products.keys'
import type { Product, ProductsResult } from '../types'

const NONE: Product[] = []

export function useProducts(): ProductsResult {
  const query = useApiQuery(productKeys.list(), productsApi.list)
  return { products: query.data ?? NONE, isLoading: query.isLoading }
}
