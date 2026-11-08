import { randomUUID } from 'crypto'

import type { AddCustomerInput, Customer, UpdateCustomerInput } from '@shared/customers/types'
import { getDb } from '../../db/connection'
import { UserError } from '../../lib/ipc'
import * as q from './customers.queries'

export function listCustomers(): Customer[] {
  return q.listCustomers(getDb())
}

export function addCustomer(input: AddCustomerInput): Customer {
  return q.insertCustomer(getDb(), {
    id: randomUUID(),
    name: input.name.trim(),
    phone: input.phone?.trim() ?? '',
    address: input.address?.trim() ?? '',
    notes: input.notes?.trim() ?? '',
    createdAt: new Date().toISOString()
  })
}

export function updateCustomer(input: UpdateCustomerInput): Customer {
  const { id, ...fields } = input
  const db = getDb()
  if (!q.findCustomerById(db, id)) throw new UserError('This customer no longer exists.')
  return q.updateCustomerRow(db, id, {
    ...fields,
    ...(fields.name !== undefined && { name: fields.name.trim() }),
    ...(fields.phone !== undefined && { phone: fields.phone.trim() }),
    ...(fields.address !== undefined && { address: fields.address.trim() }),
    ...(fields.notes !== undefined && { notes: fields.notes.trim() })
  })
}
