import { daysAgo } from '@/lib/format'
import type { Purchase, SupplierPayment } from './types'

export const demoPurchases: Purchase[] = [
  {
    id: 'pu1',
    billNo: 'BILL-1001',
    supplierId: 's1',
    items: [
      {
        productId: 'p1',
        name: 'Samsung A12 LCD Display with Touch',
        unit: 'pcs',
        qty: 10,
        costPrice: 2800
      },
      { productId: 'p4', name: 'Infinix Hot 11 Battery', unit: 'pcs', qty: 20, costPrice: 650 }
    ],
    paid: 30000,
    method: 'bank',
    note: '',
    createdAt: daysAgo(20)
  },
  {
    id: 'pu2',
    billNo: 'BILL-1002',
    supplierId: 's1',
    items: [
      { productId: 'p7', name: '25W Type-C Fast Charger', unit: 'pcs', qty: 30, costPrice: 1100 },
      { productId: 'p8', name: 'Micro USB Data Cable 1m', unit: 'pcs', qty: 60, costPrice: 100 }
    ],
    paid: 20000,
    method: 'cash',
    note: '',
    createdAt: daysAgo(7)
  }
]

export const demoSupplierPayments: SupplierPayment[] = [
  {
    id: 'sp1',
    supplierId: 's1',
    amount: 10000,
    method: 'bank',
    note: 'Part payment',
    date: daysAgo(3)
  }
]
