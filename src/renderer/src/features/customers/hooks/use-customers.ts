import { useApiQuery } from '@/lib/use-api'
import { customersApi } from '../api/customers.api'
import { customerKeys } from '../api/customers.keys'
import type { CustomersResult, Customer } from '../types'

const NONE: Customer[] = []

export function useCustomers(): CustomersResult {
  const query = useApiQuery(customerKeys.list(), customersApi.list)
  return { customers: query.data ?? NONE, isLoading: query.isLoading }
}
