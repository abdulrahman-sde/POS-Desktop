import { isMoney } from '@shared/money'
import { OTHERS_CATEGORY, type Category } from '@/features/categories/types'
import { sameName } from './match'
import type { ImportRow } from './types'

// The invoice's category heading as one of your categories: the same name, ignoring capital letters. A heading you do
// not have yet is kept, and is created when the bill is saved. No heading at all means Others.
export function resolveCategory(heading: string, categories: Category[]): string {
  const name = heading.trim()
  if (!name) return OTHERS_CATEGORY
  return categories.find((category) => sameName(category.name, name))?.name ?? name
}

// The first thing wrong with the items about to go on the bill, named by the invoice's own item number so it can be
// found on the PDF. Empty when everything is fine.
export function firstImportProblem(rows: ImportRow[], allRows: ImportRow[]): string {
  for (const row of rows) {
    const item = `Item ${row.no ?? allRows.indexOf(row) + 1}`
    const isNew = row.productId === null
    if (isNew && !row.name.trim()) return `${item} needs a name.`
    if (isNew && row.name.trim().length > 120) return `${item}: the name is too long.`
    if (!(row.qty > 0)) return `${item} needs a quantity.`
    if (!Number.isInteger(row.qty)) return `${item}: use a whole number for the quantity.`
    if (!(row.costPrice > 0)) return `${item} needs a price.`
    if (!isMoney(row.costPrice)) {
      return `${item}: use at most 2 numbers after the dot for the price.`
    }
  }
  return ''
}
