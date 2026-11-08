import { demoProducts } from '@/features/products/demo-data'
import { daysAgo } from '@/lib/format'
import type { Order, OrderItem, PaymentMethod } from './types'
import { itemsSubtotal } from './utils'

const line = (productId: string, qty: number): OrderItem => {
  const product = demoProducts.find((item) => item.id === productId)!
  return {
    productId,
    name: product.name,
    unit: product.unit,
    qty,
    unitPrice: product.salePrice,
    costPrice: product.costPrice
  }
}

// advance: 'full' = paid completely at the counter, otherwise the amount paid up front
const order = (
  n: number,
  customerId: string | null,
  days: number,
  items: OrderItem[],
  advance: 'full' | number,
  discount = 0,
  method: PaymentMethod = 'cash'
): Order => ({
  id: `o${n}`,
  invoiceNo: `INV-${1000 + n}`,
  customerId,
  items,
  discount,
  advance: advance === 'full' ? Math.max(0, itemsSubtotal(items) - discount) : advance,
  method,
  note: '',
  createdAt: daysAgo(days, 9 + (n % 8))
})

export const demoOrders: Order[] = [
  order(1, 'c1', 12, [line('p1', 4), line('p4', 10), line('p14', 20)], 10000),
  order(2, 'c7', 11, [line('p2', 5), line('p3', 3), line('p7', 10)], 20000, 500, 'bank'),
  order(3, null, 10, [line('p14', 2), line('p15', 1), line('p18', 1)], 'full'),
  order(4, 'c3', 9, [line('p1', 6), line('p5', 10), line('p13', 15)], 15000),
  order(5, 'c2', 8, [line('p9', 20), line('p8', 30), line('p14', 50)], 'full', 0, 'wallet'),
  order(6, 'c4', 7, [line('p4', 15), line('p6', 4), line('p16', 2)], 5000),
  order(7, 'c7', 5, [line('p2', 8), line('p11', 10), line('p17', 4)], 40000, 1000, 'bank'),
  order(8, null, 4, [line('p15', 2), line('p14', 1)], 'full'),
  order(9, 'c5', 3, [line('p14', 40), line('p15', 12), line('p18', 20), line('p13', 10)], 'full'),
  order(10, 'c1', 2, [line('p3', 2), line('p12', 3)], 0),
  order(11, 'c6', 1, [line('p20', 2), line('p7', 5), line('p16', 2)], 12000, 0, 'bank'),
  order(12, 'c8', 0, [line('p1', 3), line('p17', 2)], 8000)
]
