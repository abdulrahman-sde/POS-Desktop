import { randomUUID } from 'crypto'

import { autoSalePrice } from '@shared/products/pricing'
import { isWhatsAppReady } from '@shared/phone'
import { starterFileSchema } from '@shared/starter/schema'
import type { StarterFile, StarterResult, StarterStatus } from '@shared/starter/types'
import { getDb } from '../../db/connection'
import { UserError } from '../../lib/ipc'
import { findCategoryByName, insertCategory } from '../categories/categories.queries'
import { insertCustomer, listCustomers } from '../customers/customers.queries'
import { findProductByName, highestItemNumber, insertProduct } from '../products/products.queries'
import { readSettings } from '../settings/settings.service'
import { findActiveSupplierByName, insertSupplier } from '../suppliers/suppliers.queries'
import * as q from './starter.queries'

// The one-time starting data (customers, suppliers, products). It is added in ONE transaction, so a problem
// anywhere means nothing is added, and it can only succeed once.

const NOT_A_FILE = 'That is not a Stockwise starting data file.'

export function getStatus(): StarterStatus {
  const row = q.findImport(getDb())
  return { imported: row !== undefined, importedAt: row?.importedAt ?? null }
}

// Reads the text of the file. A bad row is named ("Customers, row 4: ...") so it can be fixed.
export function parseStarterFile(text: string): StarterFile {
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    throw new UserError(NOT_A_FILE)
  }
  const parsed = starterFileSchema.safeParse(json)
  if (parsed.success) return parsed.data

  const issue = parsed.error.issues[0]
  const [list, index] = issue.path
  if (typeof list === 'string' && typeof index === 'number') {
    const label = list.charAt(0).toUpperCase() + list.slice(1)
    throw new UserError(`${label}, row ${index + 1}: ${issue.message}`)
  }
  throw new UserError(issue.message || NOT_A_FILE)
}

export function importStarterData(file: StarterFile): StarterResult {
  return getDb().transaction((tx) => {
    if (q.findImport(tx)) throw new UserError('The starting data has already been imported.')

    const settings = readSettings(tx)
    const now = new Date().toISOString()
    const result: StarterResult = {
      customers: 0,
      suppliers: 0,
      products: 0,
      categories: 0,
      skipped: 0,
      notOnWhatsApp: []
    }

    const customerNames = new Set(listCustomers(tx).map((c) => c.name.trim().toLowerCase()))
    for (const row of file.customers) {
      const key = row.name.trim().toLowerCase()
      if (customerNames.has(key)) {
        result.skipped++
        continue
      }
      customerNames.add(key)
      insertCustomer(tx, {
        id: randomUUID(),
        name: row.name.trim(),
        phone: row.phone?.trim() ?? '',
        address: row.address?.trim() ?? '',
        notes: row.notes?.trim() ?? '',
        openingBalance: row.openingBalance ?? 0,
        createdAt: now
      })
      result.customers++
      if (!isWhatsAppReady(row.phone ?? '')) result.notOnWhatsApp.push(row.name.trim())
    }

    for (const row of file.suppliers) {
      if (findActiveSupplierByName(tx, row.name.trim())) {
        result.skipped++
        continue
      }
      insertSupplier(tx, {
        id: randomUUID(),
        name: row.name.trim(),
        phone: row.phone?.trim() ?? '',
        address: row.address?.trim() ?? '',
        notes: row.notes?.trim() ?? '',
        openingBalance: row.openingBalance ?? 0,
        createdAt: now
      })
      result.suppliers++
    }

    // Categories are made from the products, in the order they first appear, with the names as written.
    const categoryIds = new Map<string, string>()
    for (const row of file.products) {
      const categoryName = row.category.trim()
      let categoryId = categoryIds.get(categoryName.toLowerCase())
      if (!categoryId) {
        categoryId = findCategoryByName(tx, categoryName)?.id
        if (!categoryId) {
          categoryId = randomUUID()
          insertCategory(tx, { id: categoryId, name: categoryName })
          result.categories++
        }
        categoryIds.set(categoryName.toLowerCase(), categoryId)
      }

      if (findProductByName(tx, row.name.trim())) {
        result.skipped++
        continue
      }
      insertProduct(tx, {
        id: randomUUID(),
        itemCode: `ITM-${String(highestItemNumber(tx) + 1).padStart(4, '0')}`,
        name: row.name.trim(),
        categoryId,
        brand: '',
        quality: null,
        shelf: '',
        costPrice: row.costPrice,
        salePrice: autoSalePrice(row.costPrice, settings.defaultMarkupPercent),
        stock: row.quantity,
        reorderLevel: settings.defaultReorderLevel,
        createdAt: now
      })
      result.products++
    }

    if (result.customers + result.suppliers + result.products === 0) {
      throw new UserError('Everything in this file is already in the app, so nothing was added.')
    }
    q.insertImport(tx, now)
    return result
  })
}
