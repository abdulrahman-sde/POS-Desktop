import { useMemo, useState } from 'react'

import { demoCategories } from '@/features/categories/demo-data'
import { demoCustomers } from '@/features/customers/demo-data'
import { demoPurchases, demoSupplierPayments } from '@/features/purchases/demo-data'
import { demoSuppliers } from '@/features/suppliers/demo-data'
import { demoPayments } from '@/features/payments/demo-data'
import { demoProducts } from '@/features/products/demo-data'
import { demoOrders } from '@/features/sales/demo-data'
import { summarizeInvoices } from '@/features/sales/utils'
import { defaultSettings } from '@/features/settings/types'
import { newId } from '@/lib/format'
import { DataContext, type DataContextValue } from './data-context'

// Demo data lives in memory only: it resets when the app restarts.
// Later this provider is replaced by real database calls; screens keep using useData().
export function DataProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [products, setProducts] = useState(demoProducts)
  const [categories, setCategories] = useState(demoCategories)
  const [suppliers, setSuppliers] = useState(demoSuppliers)
  const [purchases, setPurchases] = useState(demoPurchases)
  const [supplierPayments, setSupplierPayments] = useState(demoSupplierPayments)
  const [customers, setCustomers] = useState(demoCustomers)
  const [orders, setOrders] = useState(demoOrders)
  const [payments, setPayments] = useState(demoPayments)
  const [settings, setSettings] = useState(defaultSettings)

  const invoices = useMemo(() => summarizeInvoices(orders, payments), [orders, payments])

  const value: DataContextValue = {
    products,
    categories,
    suppliers,
    purchases,
    supplierPayments,
    customers,
    orders,
    payments,
    settings,
    invoices,

    addProduct: (input) => {
      const product = { ...input, id: newId('p') }
      setProducts((prev) => [product, ...prev])
      return product
    },
    updateProduct: (id, patch) =>
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p))),
    addStock: (id, qty) =>
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: p.stock + qty } : p))),

    addCategory: (name) => {
      const category = { id: newId('cat'), name: name.trim() }
      setCategories((prev) => [...prev, category])
      return category
    },
    // Renaming a category also renames it on every product that uses it.
    renameCategory: (id, name) => {
      const old = categories.find((c) => c.id === id)?.name
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name: name.trim() } : c)))
      if (old)
        setProducts((prev) =>
          prev.map((p) => (p.category === old ? { ...p, category: name.trim() } : p))
        )
    },
    deleteCategory: (id) => setCategories((prev) => prev.filter((c) => c.id !== id)),

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
      setProducts((prev) =>
        prev.map((product) => {
          const bought = purchase.items.find((item) => item.productId === product.id)
          return bought
            ? { ...product, stock: product.stock + bought.qty, costPrice: bought.costPrice }
            : product
        })
      )
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
      // Selling reduces stock.
      setProducts((prev) =>
        prev.map((product) => {
          const sold = order.items.find((item) => item.productId === product.id)
          return sold ? { ...product, stock: Math.max(0, product.stock - sold.qty) } : product
        })
      )
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
