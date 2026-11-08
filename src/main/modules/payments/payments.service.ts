import { randomUUID } from 'crypto'

import type { CreatePaymentInput, Payment } from '@shared/payments/types'
import { getDb } from '../../db/connection'
import { UserError } from '../../lib/ipc'
import { findActiveCustomerById } from '../customers/customers.queries'
import * as q from './payments.queries'

export function listPayments(): Payment[] {
  return q.listPayments(getDb())
}

export function recordPayment(input: CreatePaymentInput): Payment {
  const db = getDb()
  if (!findActiveCustomerById(db, input.customerId)) {
    throw new UserError('Choose a customer from the list.')
  }
  return q.insertPayment(db, {
    id: randomUUID(),
    customerId: input.customerId,
    amount: input.amount,
    method: input.method,
    note: input.note,
    date: new Date().toISOString()
  })
}
