import { randomUUID } from 'crypto'

import { roundMoney } from '@shared/money'
import { FIRST_BILL_NUMBER } from '@shared/purchases/constants'
import type {
  CreatePurchaseInput,
  CreateSupplierPaymentInput,
  Purchase,
  SupplierPayment
} from '@shared/purchases/types'
import { getDb, type DbOrTx } from '../../db/connection'
import { UserError } from '../../lib/ipc'
import { findCategoryByName, insertCategory } from '../categories/categories.queries'
import {
  findProductById,
  findProductByName,
  increaseStock,
  updateProductRow
} from '../products/products.queries'
import { createProductIn } from '../products/products.service'
import { findActiveSupplierById } from '../suppliers/suppliers.queries'
import * as q from './purchases.queries'

function loadPurchase(db: DbOrTx, id: string): Purchase {
  const purchase = q.findPurchaseById(db, id)!
  return { ...purchase, items: q.listItemsOfPurchase(db, id) }
}

export function listPurchases(): Purchase[] {
  const db = getDb()
  const items = q.listPurchaseItems(db)
  return q.listPurchases(db).map((purchase) => ({
    ...purchase,
    items: items.filter((item) => item.purchaseId === purchase.id)
  }))
}

export function createPurchase(input: CreatePurchaseInput): Purchase {
  return getDb().transaction((tx) => {
    if (!findActiveSupplierById(tx, input.supplierId)) {
      throw new UserError('Choose a supplier from the list.')
    }

    // An item is one of your products, or a new one that is made right here, inside this transaction: if anything
    // fails, no category or product is kept. A new product whose name already exists is the existing product.
    const lines = input.items.map((item) => {
      if (item.productId) {
        const product = findProductById(tx, item.productId)
        if (!product) throw new UserError('One of the products no longer exists.')
        return { item, product }
      }
      const details = item.newProduct!
      const existing = findProductByName(tx, details.name.trim())
      if (existing) return { item, product: findProductById(tx, existing.id)! }
      const categoryName = details.category.trim()
      const categoryId =
        findCategoryByName(tx, categoryName)?.id ??
        insertCategory(tx, { id: randomUUID(), name: categoryName }).id
      const product = createProductIn(tx, {
        name: details.name,
        categoryId,
        brand: details.brand,
        shelf: details.shelf,
        salePrice: details.salePrice,
        reorderLevel: details.reorderLevel,
        costPrice: item.costPrice,
        stock: 0
      })
      return { item, product }
    })

    const productIds = lines.map(({ product }) => product.id)
    if (new Set(productIds).size !== productIds.length) {
      throw new UserError('Each product can be on the bill only once.')
    }

    const total = roundMoney(lines.reduce((sum, { item }) => sum + item.qty * item.costPrice, 0))
    if (input.paid > total) throw new UserError('Money paid cannot be more than the total.')

    const id = randomUUID()
    q.insertPurchase(tx, {
      id,
      billNo: `BILL-${Math.max(q.highestBillNumber(tx) + 1, FIRST_BILL_NUMBER)}`,
      supplierId: input.supplierId,
      paid: input.paid,
      method: input.method,
      note: input.note,
      createdAt: new Date().toISOString()
    })

    for (const { item, product } of lines) {
      q.insertPurchaseItem(tx, {
        id: randomUUID(),
        purchaseId: id,
        productId: product.id,
        name: product.name,
        qty: item.qty,
        costPrice: item.costPrice
      })
      increaseStock(tx, product.id, item.qty)
      updateProductRow(tx, product.id, { costPrice: item.costPrice })
    }

    return loadPurchase(tx, id)
  })
}

export function listSupplierPayments(): SupplierPayment[] {
  return q.listSupplierPayments(getDb())
}

export function paySupplier(input: CreateSupplierPaymentInput): SupplierPayment {
  const db = getDb()
  if (!findActiveSupplierById(db, input.supplierId)) {
    throw new UserError('Choose a supplier from the list.')
  }
  return q.insertSupplierPayment(db, {
    id: randomUUID(),
    supplierId: input.supplierId,
    amount: input.amount,
    method: input.method,
    note: input.note,
    date: new Date().toISOString()
  })
}
