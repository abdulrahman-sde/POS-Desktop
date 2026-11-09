import { useMemo } from 'react'

import { usePurchases } from '@/features/purchases/hooks/use-purchases'
import { useSupplierPayments } from '@/features/purchases/hooks/use-supplier-payments'
import { supplierOwed } from '@/features/purchases/utils'
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
          owed: supplierOwed(supplier.id, purchases, supplierPayments, supplier.openingBalance)
        }
      }),
    [suppliers, purchases, supplierPayments]
  )
}
