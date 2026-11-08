import { randomUUID } from 'crypto'

import { findCategoryById } from '../categories/categories.queries'
import type {
  AddProductInput,
  AddStockInput,
  Product,
  UpdateProductInput
} from '@shared/products/types'
import { autoSalePrice } from '@shared/products/pricing'
import { getDb } from '../../db/connection'
import { UserError } from '../../lib/ipc'
import * as q from './products.queries'

// The rules for products. Anything that needs to look at the database before saving goes here.
// Steps that must succeed together run inside db.transaction: if one fails, none are kept.

export function listProducts(): Product[] {
  return q.listProducts(getDb())
}

export function addProduct(input: AddProductInput): Product {
  return getDb().transaction((tx) => {
    if (!findCategoryById(tx, input.categoryId))
      throw new UserError('Choose a category from the list.')
    if (q.findProductByName(tx, input.name.trim())) {
      throw new UserError('You already have a product with this name.')
    }

    const id = randomUUID()
    q.insertProduct(tx, {
      id,
      itemCode: `ITM-${String(q.highestItemNumber(tx) + 1).padStart(4, '0')}`,
      name: input.name.trim(),
      categoryId: input.categoryId,
      brand: input.brand?.trim() ?? '',
      quality: input.quality ?? null,
      shelf: input.shelf?.trim() ?? '',
      costPrice: input.costPrice,
      // No selling price typed: use the cost price plus 15%.
      salePrice: input.salePrice ?? autoSalePrice(input.costPrice),
      stock: input.stock ?? 0,
      reorderLevel: input.reorderLevel ?? 5,
      createdAt: new Date().toISOString()
    })
    return q.findProductById(tx, id)!
  })
}

export function updateProduct(input: UpdateProductInput): Product {
  return getDb().transaction((tx) => {
    const { id, ...fields } = input
    if (!q.findProductById(tx, id)) throw new UserError('This product no longer exists.')
    if (fields.categoryId && !findCategoryById(tx, fields.categoryId)) {
      throw new UserError('Choose a category from the list.')
    }
    if (fields.name) {
      const same = q.findProductByName(tx, fields.name.trim())
      if (same && same.id !== id) throw new UserError('You already have a product with this name.')
    }

    q.updateProductRow(tx, id, {
      ...fields,
      ...(fields.name !== undefined && { name: fields.name.trim() }),
      ...(fields.brand !== undefined && { brand: fields.brand.trim() }),
      ...(fields.shelf !== undefined && { shelf: fields.shelf.trim() })
    })
    return q.findProductById(tx, id)!
  })
}

export function addStock(input: AddStockInput): Product {
  return getDb().transaction((tx) => {
    if (!q.findProductById(tx, input.id)) throw new UserError('This product no longer exists.')
    q.increaseStock(tx, input.id, input.qty)
    return q.findProductById(tx, input.id)!
  })
}

export function deleteProduct(id: string): void {
  return getDb().transaction((tx) => {
    if (!q.findProductById(tx, id)) throw new UserError('This product no longer exists.')
    q.softDeleteProduct(tx, id, new Date().toISOString())
  })
}

export function restoreProduct(id: string): void {
  getDb().transaction((tx) => {
    const product = q.findDeletedProductById(tx, id)
    if (!product) throw new UserError('This product is not in the deleted list.')
    if (product.categoryDeletedAt) {
      throw new UserError(
        `Its category "${product.category}" was deleted. Bring the category back first.`
      )
    }
    if (q.findProductByName(tx, product.name)) {
      throw new UserError(
        'You already have a product with this name, so this one cannot be brought back.'
      )
    }
    q.restoreProductRow(tx, id)
  })
}
