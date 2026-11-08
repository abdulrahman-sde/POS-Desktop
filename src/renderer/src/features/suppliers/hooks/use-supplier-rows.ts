import { useMemo } from 'react'

import { usePurchases } from '@/features/purchases/hooks/use-purchases'
import { useSupplierPayments } from '@/features/purchases/hooks/use-supplier-payments'
import { purchaseSubtotal, supplierOwed } from '@/features/purchases/utils'
import type { SupplierRow } from '../types'
import { useSuppliers } from './use-suppliers'

export function useSupplierRows(): SupplierRow[] {
  const { suppliers } = useSuppliers()
  const { purchases } = usePurchases()
  const { supplierPayments } = useSupplierPayments()

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
