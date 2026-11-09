import { randomUUID } from 'crypto'

import { roundMoney } from '@shared/money'
import type { AddCustomerInput, Customer, UpdateCustomerInput } from '@shared/customers/types'
import { getDb } from '../../db/connection'
import { UserError } from '../../lib/ipc'
import { sumPaidByCustomer } from '../payments/payments.queries'
import { unpaidAtSale } from '../sales/sales.queries'
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
    openingBalance: input.openingBalance ?? 0,
    createdAt: new Date().toISOString()
  })
}

export function updateCustomer(input: UpdateCustomerInput): Customer {
  const { id, ...fields } = input
  const db = getDb()
  if (!q.findActiveCustomerById(db, id)) throw new UserError('This customer no longer exists.')
  return q.updateCustomerRow(db, id, {
    ...fields,
    ...(fields.name !== undefined && { name: fields.name.trim() }),
    ...(fields.phone !== undefined && { phone: fields.phone.trim() }),
    ...(fields.address !== undefined && { address: fields.address.trim() }),
    ...(fields.notes !== undefined && { notes: fields.notes.trim() })
  })
}

export function deleteCustomer(id: string): void {
  const db = getDb()
  const customer = q.findActiveCustomerById(db, id)
  if (!customer) throw new UserError('This customer no longer exists.')
  const owed = roundMoney(
    customer.openingBalance + unpaidAtSale(db, id) - sumPaidByCustomer(db, id)
  )
  if (owed > 0) {
    throw new UserError(
      `This customer still owes you Rs ${new Intl.NumberFormat('en-PK').format(owed)}. Receive payment first.`
    )
  }
  q.softDeleteCustomer(db, id, new Date().toISOString())
}

export function restoreCustomer(id: string): void {
  const db = getDb()
  if (!q.findDeletedCustomerById(db, id))
    throw new UserError('This customer is not in the deleted list.')
  q.restoreCustomerRow(db, id)
}
