import { useMemo, useState } from 'react'

import { summarizeInvoices } from '@/features/sales/utils'
import { defaultSettings } from '@/features/settings/types'
import { newId } from '@/lib/format'
import type { Customer } from '@/features/customers/types'
import type { Payment } from '@/features/payments/types'
import type { Purchase, SupplierPayment } from '@/features/purchases/types'
import type { Order } from '@/features/sales/types'
import type { Supplier } from '@/features/suppliers/types'
import { DataContext, type DataContextValue } from './data-context'

export function DataProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [supplierPayments, setSupplierPayments] = useState<SupplierPayment[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [settings, setSettings] = useState(defaultSettings)

  const invoices = useMemo(() => summarizeInvoices(orders, payments), [orders, payments])

  const value: DataContextValue = {
    suppliers,
    purchases,
    supplierPayments,
    customers,
    orders,
    payments,
    settings,
    invoices,

    addSupplier: (input) => {
      const supplier = { ...input, id: newId('s'), createdAt: new Date().toISOString() }
      setSuppliers((prev) => [...prev, supplier])
      return supplier
    },
    updateSupplier: (id, patch) =>
      setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s))),
    deleteSupplier: (id) => setSuppliers((prev) => prev.filter((s) => s.id !== id)),

    // Saving a bill from a supplier adds the items to your stock, and the cost on the bill
    // becomes the product's new cost price.
    createPurchase: (input) => {
      const purchase = {
        ...input,
        id: newId('pu'),
        billNo: `BILL-${1001 + purchases.length}`,
        createdAt: new Date().toISOString()
      }
      setPurchases((prev) => [purchase, ...prev])
      return purchase
    },
    paySupplier: (input) => {
      const payment = { ...input, id: newId('sp'), date: new Date().toISOString() }
      setSupplierPayments((prev) => [payment, ...prev])
      return payment
    },

    addCustomer: (input) => {
      const customer = { ...input, id: newId('c'), createdAt: new Date().toISOString() }
      setCustomers((prev) => [customer, ...prev])
      return customer
    },
    updateCustomer: (id, patch) =>
      setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c))),

    createOrder: (input) => {
      const number = 1001 + orders.length
      const order = {
        ...input,
        id: newId('o'),
        invoiceNo: `INV-${number}`,
        createdAt: new Date().toISOString()
      }
      setOrders((prev) => [order, ...prev])
      return order
    },

    recordPayment: (input) => {
      const payment = { ...input, id: newId('pay'), date: new Date().toISOString() }
      setPayments((prev) => [payment, ...prev])
      return payment
    },

    updateSettings: (patch) => setSettings((prev) => ({ ...prev, ...patch }))
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
