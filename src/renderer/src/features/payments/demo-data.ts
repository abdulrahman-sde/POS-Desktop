import { daysAgo } from '@/lib/format'
import type { Payment } from './types'

export const demoPayments: Payment[] = [
  {
    id: 'pay1',
    customerId: 'c1',
    amount: 15000,
    method: 'cash',
    note: 'Part payment',
    date: daysAgo(8)
  },
  { id: 'pay2', customerId: 'c3', amount: 8000, method: 'bank', note: '', date: daysAgo(6) },
  {
    id: 'pay3',
    customerId: 'c7',
    amount: 50000,
    method: 'bank',
    note: 'Weekly settlement',
    date: daysAgo(4)
  },
  { id: 'pay4', customerId: 'c4', amount: 5000, method: 'wallet', note: '', date: daysAgo(2) }
]
