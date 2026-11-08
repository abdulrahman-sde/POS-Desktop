import { randomUUID } from 'crypto'

import { PRODUCT_UNIT } from '@shared/products/constants'
import { FIRST_INVOICE_NUMBER } from '@shared/sales/constants'
import type { CreateOrderInput, Order } from '@shared/sales/types'
import { getDb, type DbOrTx } from '../../db/connection'
import { UserError } from '../../lib/ipc'
import { findActiveCustomerById } from '../customers/customers.queries'
import { decreaseStock, findProductById } from '../products/products.queries'
import * as q from './sales.queries'

function loadOrder(db: DbOrTx, id: string): Order {
  const order = q.findOrderById(db, id)!
  return { ...order, items: q.listItemsOfOrder(db, id) }
}

export function listOrders(): Order[] {
  const db = getDb()
  const items = q.listOrderItems(db)
  return q.listOrders(db).map((order) => ({
    ...order,
    items: items.filter((item) => item.orderId === order.id)
  }))
}

export function createOrder(input: CreateOrderInput): Order {
  return getDb().transaction((tx) => {
    if (input.customerId && !findActiveCustomerById(tx, input.customerId)) {
      throw new UserError('Choose a customer from the list.')
    }

    const productIds = input.items.map((item) => item.productId)
    if (new Set(productIds).size !== productIds.length) {
      throw new UserError('Each product can be on the bill only once.')
    }

    const lines = input.items.map((item) => {
      const product = findProductById(tx, item.productId)
      if (!product) throw new UserError('One of the products no longer exists.')
      if (item.qty > product.stock) {
        throw new UserError(
          `Only ${product.stock} ${PRODUCT_UNIT} of ${product.name} left in stock.`
        )
      }
      return { item, product }
    })

    const subtotal = lines.reduce((sum, { item }) => sum + item.qty * item.unitPrice, 0)
    if (input.discount > subtotal)
      throw new UserError('The discount cannot be more than the total.')
    const total = subtotal - input.discount
    if (total <= 0) throw new UserError('The total must be more than zero.')
    if (input.advance > total) throw new UserError('Money received cannot be more than the total.')
    if (!input.customerId && input.advance < total) {
      throw new UserError('Walk-in customers must pay the full amount.')
    }

    const id = randomUUID()
    q.insertOrder(tx, {
      id,
      invoiceNo: `INV-${Math.max(q.highestInvoiceNumber(tx) + 1, FIRST_INVOICE_NUMBER)}`,
      customerId: input.customerId,
      discount: input.discount,
      advance: input.advance,
      method: input.method,
      note: input.note,
      createdAt: new Date().toISOString()
    })

    for (const { item, product } of lines) {
      q.insertOrderItem(tx, {
        id: randomUUID(),
        orderId: id,
        productId: product.id,
        name: product.name,
        qty: item.qty,
        unitPrice: item.unitPrice,
        costPrice: product.costPrice
      })
      if (decreaseStock(tx, product.id, item.qty) === 0) {
        throw new UserError(
          `Only ${product.stock} ${PRODUCT_UNIT} of ${product.name} left in stock.`
        )
      }
    }

    return loadOrder(tx, id)
  })
}
