export type PartQuality = 'original' | 'oem' | 'copy' | 'refurbished'

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

export const warrantyOptions = [
  'No warranty',
  '7 days',
  '15 days',
  '1 month',
  '3 months',
  '6 months',
  '1 year'
] as const

export const unitOptions = ['pcs', 'set', 'pair', 'box', 'kit'] as const

export type Product = {
  id: string
  name: string
  sku: string
  barcode: string
  category: string
  brand: string // e.g. Samsung, Apple, Xiaomi
  compatibleModels: string // e.g. "Galaxy A12, A125F"
  quality?: PartQuality // not asked when adding a product; shown only when set
  color: string
  warranty: string
  shelf: string // where it is kept in the shop
  unit: string
  costPrice: number // what you paid
  salePrice: number // the usual selling price. It fills in at the till, and can be changed for each sale
  stock: number
  reorderLevel: number
}

export type StockLevel = 'out' | 'low' | 'ok'

export function getStockLevel(product: Product): StockLevel {
  if (product.stock <= 0) return 'out'
  if (product.stock <= product.reorderLevel) return 'low'
  return 'ok'
}
