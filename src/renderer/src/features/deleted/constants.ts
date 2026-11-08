import type { DeletedRecords } from '@shared/deleted/types'
import type { DeletedTab } from './types'

export const EMPTY_DELETED: DeletedRecords = {
  products: [],
  customers: [],
  suppliers: [],
  categories: []
}

export const deletedTabs: DeletedTab[] = [
  { value: 'products', label: 'Products', kind: 'product', empty: 'No deleted products.' },
  { value: 'customers', label: 'Customers', kind: 'customer', empty: 'No deleted customers.' },
  { value: 'suppliers', label: 'Suppliers', kind: 'supplier', empty: 'No deleted suppliers.' },
  { value: 'categories', label: 'Categories', kind: 'category', empty: 'No deleted categories.' }
]
