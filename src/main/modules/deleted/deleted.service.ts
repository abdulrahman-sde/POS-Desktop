import type { DeletedRecords, RestoreInput } from '@shared/deleted/types'
import { getDb } from '../../db/connection'
import { listDeletedCategories } from '../categories/categories.queries'
import { restoreCategory } from '../categories/categories.service'
import { listDeletedCustomers } from '../customers/customers.queries'
import { restoreCustomer } from '../customers/customers.service'
import { listDeletedProducts } from '../products/products.queries'
import { restoreProduct } from '../products/products.service'
import { listDeletedSuppliers } from '../suppliers/suppliers.queries'
import { restoreSupplier } from '../suppliers/suppliers.service'

export function listDeleted(): DeletedRecords {
  const db = getDb()
  return {
    products: listDeletedProducts(db).map((p) => ({
      id: p.id,
      name: p.name,
      detail: `${p.itemCode} · ${p.category}`,
      deletedAt: p.deletedAt!
    })),
    customers: listDeletedCustomers(db).map((c) => ({
      id: c.id,
      name: c.name,
      detail: c.phone,
      deletedAt: c.deletedAt!
    })),
    suppliers: listDeletedSuppliers(db).map((s) => ({
      id: s.id,
      name: s.name,
      detail: s.phone,
      deletedAt: s.deletedAt!
    })),
    categories: listDeletedCategories(db).map((c) => ({
      id: c.id,
      name: c.name,
      detail: '',
      deletedAt: c.deletedAt!
    }))
  }
}

export function restore({ kind, id }: RestoreInput): void {
  if (kind === 'product') restoreProduct(id)
  else if (kind === 'customer') restoreCustomer(id)
  else if (kind === 'supplier') restoreSupplier(id)
  else restoreCategory(id)
}
