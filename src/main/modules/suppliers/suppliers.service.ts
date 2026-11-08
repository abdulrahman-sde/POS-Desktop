import { randomUUID } from 'crypto'

import type { AddSupplierInput, Supplier, UpdateSupplierInput } from '@shared/suppliers/types'
import { getDb } from '../../db/connection'
import { UserError } from '../../lib/ipc'
import { owedToSupplier } from '../purchases/purchases.queries'
import * as q from './suppliers.queries'

export function listSuppliers(): Supplier[] {
  return q.listSuppliers(getDb())
}

export function addSupplier(input: AddSupplierInput): Supplier {
  const db = getDb()
  if (q.findActiveSupplierByName(db, input.name.trim())) {
    throw new UserError('You already have a supplier with this name.')
  }
  return q.insertSupplier(db, {
    id: randomUUID(),
    name: input.name.trim(),
    phone: input.phone?.trim() ?? '',
    address: input.address?.trim() ?? '',
    notes: input.notes?.trim() ?? '',
    createdAt: new Date().toISOString()
  })
}

export function updateSupplier(input: UpdateSupplierInput): Supplier {
  const { id, ...fields } = input
  const db = getDb()
  if (!q.findActiveSupplierById(db, id)) throw new UserError('This supplier no longer exists.')
  if (fields.name) {
    const same = q.findActiveSupplierByName(db, fields.name.trim())
    if (same && same.id !== id) throw new UserError('You already have a supplier with this name.')
  }
  return q.updateSupplierRow(db, id, {
    ...fields,
    ...(fields.name !== undefined && { name: fields.name.trim() }),
    ...(fields.phone !== undefined && { phone: fields.phone.trim() }),
    ...(fields.address !== undefined && { address: fields.address.trim() }),
    ...(fields.notes !== undefined && { notes: fields.notes.trim() })
  })
}

export function deleteSupplier(id: string): void {
  const db = getDb()
  if (!q.findActiveSupplierById(db, id)) throw new UserError('This supplier no longer exists.')
  const owed = owedToSupplier(db, id)
  if (owed > 0) {
    throw new UserError(
      `You still owe this supplier Rs ${new Intl.NumberFormat('en-PK').format(owed)}. Pay them first.`
    )
  }
  q.softDeleteSupplier(db, id, new Date().toISOString())
}
