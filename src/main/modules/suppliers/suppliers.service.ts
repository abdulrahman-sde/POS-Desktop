import { randomUUID } from 'crypto'

import { roundMoney } from '@shared/money'
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
    openingBalance: input.openingBalance ?? 0,
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
  const supplier = q.findActiveSupplierById(db, id)
  if (!supplier) throw new UserError('This supplier no longer exists.')
  const owed = roundMoney(supplier.openingBalance + owedToSupplier(db, id))
  if (owed > 0) {
    throw new UserError(
      `You still owe this supplier Rs ${new Intl.NumberFormat('en-PK').format(owed)}. Pay them first.`
    )
  }
  q.softDeleteSupplier(db, id, new Date().toISOString())
}

export function restoreSupplier(id: string): void {
  const db = getDb()
  const supplier = q.findDeletedSupplierById(db, id)
  if (!supplier) throw new UserError('This supplier is not in the deleted list.')
  if (q.findActiveSupplierByName(db, supplier.name)) {
    throw new UserError(
      'You already have a supplier with this name, so this one cannot be brought back.'
    )
  }
  q.restoreSupplierRow(db, id)
}
