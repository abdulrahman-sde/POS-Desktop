import { useState } from 'react'
import { toast } from 'sonner'

import { useData } from '@/app/providers/data-context'
import { OTHERS_CATEGORY } from '@/features/categories/types'
import { autoSalePrice, newProductExtras } from '@/features/products/utils'
import { extractInvoice } from '../extract'
import { findProductByName } from '../match'
import type { ExtractedInvoice, ImportEntry, ImportRow } from '../types'
import { resolveCategory } from '../utils'

export type ImportSession = {
  file: File
  status: 'reading' | 'ready'
  invoice: ExtractedInvoice | null
  rows: ImportRow[]
}

// The invoice being imported. It lives in a provider (not in the page), so leaving the page and coming back loses nothing.
export function useImportSession() {
  const { products, categories, addProduct, addCategory } = useData()
  const [session, setSession] = useState<ImportSession | null>(null)

  const start = async (file: File): Promise<boolean> => {
    setSession({ file, status: 'reading', invoice: null, rows: [] })
    try {
      const invoice = await extractInvoice(file)
      const rows: ImportRow[] = invoice.lines.map((line) => {
        // An existing product only when the name is the same (capital letters ignored). Everything else is new.
        const match = findProductByName(line.name, products)
        return {
          id: line.id,
          no: line.no,
          invoiceName: line.name,
          name: line.name,
          heading: resolveCategory(line.category, categories),
          category: resolveCategory(line.category, categories),
          qty: line.qty,
          costPrice: line.costPrice,
          productId: match?.id ?? null,
          included: true,
          details: { brand: '', salePrice: null, reorderLevel: 5, shelf: '' }
        }
      })
      setSession((prev) =>
        prev && prev.file === file ? { file, status: 'ready', invoice, rows } : prev
      )
      return true
    } catch {
      setSession((prev) => (prev && prev.file === file ? null : prev))
      toast.error('We could not read this invoice. Please try another file.')
      return false
    }
  }

  const clear = (): void => setSession(null)

  // A new product the owner types in by hand (for example one the PDF reading missed). It starts under Others.
  const addRow = (): string => {
    const id = `m${Date.now().toString(36)}`
    setSession((prev) =>
      prev
        ? {
            ...prev,
            rows: [
              ...prev.rows,
              {
                id,
                no: Math.max(0, ...prev.rows.map((row) => row.no ?? 0)) + 1,
                invoiceName: '',
                name: '',
                heading: OTHERS_CATEGORY,
                category: OTHERS_CATEGORY,
                qty: 1,
                costPrice: 0,
                productId: null,
                included: true,
                details: { brand: '', salePrice: null, reorderLevel: 5, shelf: '' }
              }
            ]
          }
        : prev
    )
    return id
  }

  const patchRow = (id: string, patch: Partial<ImportRow>): void =>
    setSession((prev) =>
      prev
        ? { ...prev, rows: prev.rows.map((row) => (row.id === id ? { ...row, ...patch } : row)) }
        : prev
    )

  // The owner says this item is one of your products, or that it is a new one. The row stays where it is in the list.
  const pickProduct = (id: string, productId: string): void => patchRow(id, { productId })
  const pickNew = (id: string): void => patchRow(id, { productId: null })

  // Creates the new products (and any new categories) and returns the lines for the bill. Nothing is created before this.
  const commit = (): ImportEntry[] => {
    if (!session) return []
    const entries: ImportEntry[] = []
    const madeCategories = new Set(categories.map((c) => c.name))
    const madeProducts = new Map<string, string>() // two lines for the same new product make only one product

    for (const row of session.rows.filter((r) => r.included)) {
      if (row.productId) {
        entries.push({ productId: row.productId, qty: row.qty, costPrice: row.costPrice })
        continue
      }

      const category = row.category || OTHERS_CATEGORY
      if (!madeCategories.has(category)) {
        addCategory(category)
        madeCategories.add(category)
      }
      const key = `${row.name.trim().toLowerCase()}|${category}`
      let productId = madeProducts.get(key)
      if (!productId) {
        productId = addProduct({
          name: row.name.trim(),
          category,
          brand: row.details.brand,
          costPrice: row.costPrice,
          salePrice: row.details.salePrice ?? autoSalePrice(row.costPrice),
          stock: 0, // the bill adds the quantity
          reorderLevel: row.details.reorderLevel,
          shelf: row.details.shelf,
          ...newProductExtras(category)
        }).id
        madeProducts.set(key, productId)
      }
      entries.push({ productId, qty: row.qty, costPrice: row.costPrice })
    }

    return entries
  }

  return { session, start, clear, addRow, patchRow, pickProduct, pickNew, commit }
}

export type ImportSessionApi = ReturnType<typeof useImportSession>
