import { OTHERS_CATEGORY, type Category } from '@/features/categories/types'
import { sameName } from './match'

// The invoice's category heading as one of your categories: the same name, ignoring capital letters. A heading you do
// not have yet is kept, and is created when you add the items. No heading at all means Others.
export function resolveCategory(heading: string, categories: Category[]): string {
  const name = heading.trim()
  if (!name) return OTHERS_CATEGORY
  return categories.find((category) => sameName(category.name, name))?.name ?? name
}
