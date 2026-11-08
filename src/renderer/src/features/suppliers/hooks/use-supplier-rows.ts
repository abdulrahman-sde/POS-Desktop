import { useMemo } from 'react'

import { useData } from '@/app/providers/data-context'
import { purchaseSubtotal, supplierOwed } from '@/features/purchases/utils'
import type { Supplier } from '../types'

export type SupplierRow = {
  supplier: Supplier
  billCount: number
  totalBought: number // all the stock you bought from them
  owed: number // what you still have to pay them
}

export function useSupplierRows(): SupplierRow[] {
  const { suppliers, purchases, supplierPayments } = useData()

  return useMemo(
    () =>
      suppliers.map((supplier) => {
        const bills = purchases.filter((purchase) => purchase.supplierId === supplier.id)
        return {
          supplier,
          billCount: bills.length,
          totalBought: bills.reduce((sum, bill) => sum + purchaseSubtotal(bill.items), 0),
          owed: supplierOwed(supplier.id, purchases, supplierPayments)
        }
      }),
    [suppliers, purchases, supplierPayments]
  )
}
