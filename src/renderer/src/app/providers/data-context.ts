import { createContext, useContext } from 'react'

import type { Purchase, PurchaseItem, SupplierPayment } from '@/features/purchases/types'
import type { PaymentMethod } from '@/features/sales/types'
import type { ShopSettings } from '@/features/settings/types'

export type NewPurchaseInput = {
  supplierId: string
  items: PurchaseItem[]
  paid: number
  method: PaymentMethod
  note: string
}

export type NewSupplierPaymentInput = Pick<
  SupplierPayment,
  'supplierId' | 'amount' | 'method' | 'note'
>

export type DataContextValue = {
  purchases: Purchase[]
  supplierPayments: SupplierPayment[]
  settings: ShopSettings
  createPurchase: (input: NewPurchaseInput) => Purchase
  paySupplier: (input: NewSupplierPaymentInput) => SupplierPayment
  updateSettings: (patch: Partial<ShopSettings>) => void
}

export const DataContext = createContext<DataContextValue | null>(null)

// Every screen reads and changes the demo data through this hook.
export function useData(): DataContextValue {
  const value = useContext(DataContext)
  if (!value) throw new Error('useData must be used inside <DataProvider>')
  return value
}
