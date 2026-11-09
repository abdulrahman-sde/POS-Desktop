import { useMemo } from 'react'

import { usePayments } from '@/features/payments/hooks/use-payments'
import { useOrders } from '@/features/sales/hooks/use-orders'
import { customerBalance } from '@/features/sales/utils'
import type { CustomerRow } from '../types'
import { useCustomers } from './use-customers'

export function useCustomerRows(): CustomerRow[] {
  const { customers } = useCustomers()
  const { payments } = usePayments()
  const { orders } = useOrders()

  return useMemo(
    () =>
      customers.map((customer) => {
        const own = orders.filter((order) => order.customerId === customer.id)
        const last =
          own
            .map((order) => order.createdAt)
            .sort()
            .at(-1) ?? null
        return {
          customer,
          balance: customerBalance(customer.id, orders, payments, customer.openingBalance),
          orderCount: own.length,
          lastOrderAt: last
        }
      }),
    [customers, orders, payments]
  )
}
