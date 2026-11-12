import type { Purchase, PurchaseItemRow, SupplierPayment } from '@shared/purchases/types'
import type { Product } from '@/features/products/types'

export type { Purchase, SupplierPayment }

// productId of a line that is a new product (not saved yet) is a made-up key, only used to find the line on the screen.
export type PurchaseItem = Pick<PurchaseItemRow, 'productId' | 'name' | 'qty' | 'costPrice'> & {
  isNew?: boolean
}

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
