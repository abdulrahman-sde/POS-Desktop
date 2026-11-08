import type { Product } from '@/features/products/types'
import type { PaymentMethod } from '@/features/sales/types'

// One product on a bill you received from a supplier.
export type PurchaseItem = {
  productId: string
  name: string
  unit: string
  qty: number
  costPrice: number // what you paid for ONE piece on this bill
}

// A bill from a supplier. Saving it adds the items to your stock.
export type Purchase = {
  id: string
  billNo: string
  supplierId: string
  items: PurchaseItem[]
  paid: number // money given to the supplier when the stock arrived
  method: PaymentMethod
  note: string
  createdAt: string
}

// Money given to a supplier later, to reduce what you owe them.
export type SupplierPayment = {
  id: string
  supplierId: string
  amount: number
  method: PaymentMethod
  note: string
  date: string
}

export type PurchaseProductSearchProps = {
  onAdd: (product: Product) => void
}
