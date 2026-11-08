export type PaymentMethod = 'cash' | 'bank' | 'wallet'

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  cash: 'Cash',
  bank: 'Bank transfer',
  wallet: 'Mobile wallet'
}

export type OrderItem = {
  productId: string
  name: string
  unit: string
  qty: number
  unitPrice: number // the price it was sold at
  costPrice: number // what it cost you, saved so profit stays right later
}

export type Order = {
  id: string
  invoiceNo: string
  customerId: string | null // null = walk-in customer
  items: OrderItem[]
  discount: number
  advance: number // paid at the time of sale
  method: PaymentMethod
  note: string
  createdAt: string
}

export type InvoiceStatus = 'paid' | 'partial' | 'unpaid'

export type InvoiceSummary = {
  total: number
  paid: number
  due: number
  status: InvoiceStatus
}
