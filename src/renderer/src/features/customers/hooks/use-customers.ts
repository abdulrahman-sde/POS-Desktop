import { useMemo } from 'react'

import { useApiQuery } from '@/lib/use-api'
import { customersApi } from '../api/customers.api'
import { customerKeys } from '../api/customers.keys'
import type { Customer, CustomersResult } from '../types'

const NONE: Customer[] = []

export function useCustomers(): CustomersResult {
  const query = useApiQuery(customerKeys.list(), customersApi.list)
  const allCustomers = query.data ?? NONE
  const customers = useMemo(() => allCustomers.filter((c) => !c.deletedAt), [allCustomers])
  return { customers, allCustomers, isLoading: query.isLoading }
}
