import { useMemo } from 'react'

import { useData } from '@/app/providers/data-context'
import { customerBalance } from '@/features/sales/utils'
import type { CustomerRow } from '../types'
import { useCustomers } from './use-customers'

export function useCustomerRows(): CustomerRow[] {
  const { customers } = useCustomers()
  const { orders, payments } = useData()

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
          balance: customerBalance(customer.id, orders, payments),
          orderCount: own.length,
          lastOrderAt: last
        }
      }),
    [customers, orders, payments]
  )
}
