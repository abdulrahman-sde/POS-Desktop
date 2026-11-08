import type { Purchase, PurchaseItemRow, SupplierPayment } from '@shared/purchases/types'
import type { Product } from '@/features/products/types'

export type { Purchase, SupplierPayment }

export type PurchaseItem = Pick<PurchaseItemRow, 'productId' | 'name' | 'qty' | 'costPrice'>

export type PurchasesResult = {
  purchases: Purchase[]
  isLoading: boolean
}

export type SupplierPaymentsResult = {
  supplierPayments: SupplierPayment[]
  isLoading: boolean
}

export type PurchaseProductSearchProps = {
  onAdd: (product: Product) => void
}
