import { useMemo } from 'react'

import { useData } from '@/app/providers/data-context'
import { purchaseSubtotal, supplierOwed } from '@/features/purchases/utils'
import type { SupplierRow } from '../types'
import { useSuppliers } from './use-suppliers'

export function useSupplierRows(): SupplierRow[] {
  const { suppliers } = useSuppliers()
  const { purchases, supplierPayments } = useData()

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
