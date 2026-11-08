// The category type and its rules come from src/shared (the Drizzle table is the single source).
import type { Category } from '@shared/categories/types'

export type { Category }
export { OTHERS_CATEGORY } from '@shared/categories/types'

export type CategoriesResult = {
  categories: Category[]
  isLoading: boolean
}

export type CategoryRow = {
  category: Category
  productCount: number
  stockValue: number
}

export type CategoryFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category
  onSaved?: (name: string) => void
}

export type CategoryFormProps = {
  category?: Category
  onSaved?: (name: string) => void
  onDone: () => void
}
