import { createContext, useContext } from 'react'

import type { Payment } from '@/features/payments/types'
import type { Purchase, PurchaseItem, SupplierPayment } from '@/features/purchases/types'
import type { InvoiceSummary, Order, OrderItem, PaymentMethod } from '@/features/sales/types'
import type { ShopSettings } from '@/features/settings/types'

export type NewOrderInput = {
  customerId: string | null
  items: OrderItem[]
  discount: number
  advance: number
  method: PaymentMethod
  note: string
}

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

export type NewPaymentInput = Pick<Payment, 'customerId' | 'amount' | 'method' | 'note'>

export type DataContextValue = {
  purchases: Purchase[]
  supplierPayments: SupplierPayment[]
  orders: Order[]
  payments: Payment[]
  settings: ShopSettings
  invoices: Map<string, InvoiceSummary>
  createPurchase: (input: NewPurchaseInput) => Purchase
  paySupplier: (input: NewSupplierPaymentInput) => SupplierPayment
  createOrder: (input: NewOrderInput) => Order
  recordPayment: (input: NewPaymentInput) => Payment
  updateSettings: (patch: Partial<ShopSettings>) => void
}

export const DataContext = createContext<DataContextValue | null>(null)

// Every screen reads and changes the demo data through this hook.
export function useData(): DataContextValue {
  const value = useContext(DataContext)
  if (!value) throw new Error('useData must be used inside <DataProvider>')
  return value
}
