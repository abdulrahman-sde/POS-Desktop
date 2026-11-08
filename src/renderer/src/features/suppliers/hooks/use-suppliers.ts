import { useMemo } from 'react'

import { useApiQuery } from '@/lib/use-api'
import { suppliersApi } from '../api/suppliers.api'
import { supplierKeys } from '../api/suppliers.keys'
import type { Supplier, SuppliersResult } from '../types'

const NONE: Supplier[] = []

export function useSuppliers(): SuppliersResult {
  const query = useApiQuery(supplierKeys.list(), suppliersApi.list)
  const allSuppliers = query.data ?? NONE
  const suppliers = useMemo(() => allSuppliers.filter((c) => !c.deletedAt), [allSuppliers])
  return { suppliers, allSuppliers, isLoading: query.isLoading }
}
