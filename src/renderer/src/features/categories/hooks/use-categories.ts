import { useApiQuery } from '@/lib/use-api'
import { categoriesApi } from '../api/categories.api'
import { categoryKeys } from '../api/categories.keys'
import type { CategoriesResult, Category } from '../types'

const NONE: Category[] = []

export function useCategories(): CategoriesResult {
  const query = useApiQuery(categoryKeys.list(), categoriesApi.list)
  return { categories: query.data ?? NONE, isLoading: query.isLoading }
}
