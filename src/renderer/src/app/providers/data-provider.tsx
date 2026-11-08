import { useState } from 'react'

import { defaultSettings } from '@/features/settings/types'
import { newId } from '@/lib/format'
import type { Purchase, SupplierPayment } from '@/features/purchases/types'
import { DataContext, type DataContextValue } from './data-context'

export function DataProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [supplierPayments, setSupplierPayments] = useState<SupplierPayment[]>([])
  const [settings, setSettings] = useState(defaultSettings)

  const value: DataContextValue = {
    purchases,
    supplierPayments,
    settings,

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

    updateSettings: (patch) => setSettings((prev) => ({ ...prev, ...patch }))
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
