import type { PartQuality } from '@shared/products/constants'
import type { Product } from '@shared/products/types'

// The product type comes from src/shared (the Drizzle table is the single source).
export type { Product } from '@shared/products/types'
export type { PartQuality } from '@shared/products/constants'
export { PRODUCT_UNIT } from '@shared/products/constants'

export const qualityLabels: Record<PartQuality, string> = {
  original: 'Original',
  oem: 'OEM / Service pack',
  copy: 'A-grade copy',
  refurbished: 'Refurbished'
}

// Short names for small spaces like the New Sale tiles.
export const qualityShortLabels: Record<PartQuality, string> = {
  original: 'Original',
  oem: 'OEM',
  copy: 'A-grade',
  refurbished: 'Refurbished'
}

export type StockLevel = 'out' | 'low' | 'ok'

export function getStockLevel(product: Pick<Product, 'stock' | 'reorderLevel'>): StockLevel {
  if (product.stock <= 0) return 'out'
  if (product.stock <= product.reorderLevel) return 'low'
  return 'ok'
}

export type ProductsResult = {
  products: Product[]
  isLoading: boolean
}

export type ProductDraftValues = {
  name: string
  category: string
  brand: string
  costPrice: number
  salePrice: number | null
  quantity: number
  reorderLevel: number
  shelf: string
}

export type ProductDraft = {
  values: ProductDraftValues
  onSave: (values: ProductDraftValues) => void
  onUseExisting?: () => void
}

export type ProductFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product
  onSaved?: (product: Product) => void
  stockFromBill?: boolean
  draft?: ProductDraft
  onDelete?: () => void // shown only when editing: a quiet Delete at the bottom left of the dialog
}

export type ProductFormProps = {
  product?: Product
  onSaved?: (product: Product) => void
  stockFromBill?: boolean
  draft?: ProductDraft
  onDelete?: () => void
  onDone: () => void
}

export type AddStockDialogProps = {
  product: Product | null
  onOpenChange: (open: boolean) => void
}

export type AddStockFormProps = {
  product: Product
  onDone: () => void
}

export type ProductFormFields = {
  name: string
  category: string
  brand: string
  costPrice: string
  salePrice: string
  stock: string
  reorderLevel: string
  shelf: string
}

export type ProductFormErrors = Record<string, string>

export type ProductsTableProps = {
  products: Product[]
  onEdit: (product: Product) => void
  onAddStock: (product: Product) => void
}

export type ProductDeleteDialogProps = {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}
