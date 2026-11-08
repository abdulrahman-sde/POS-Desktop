import { useState } from 'react'
import { toast } from 'sonner'

import { useQueryClient } from '@tanstack/react-query'

import { categoriesApi } from '@/features/categories/api/categories.api'
import { categoryKeys } from '@/features/categories/api/categories.keys'
import { useCategories } from '@/features/categories/hooks/use-categories'
import { OTHERS_CATEGORY } from '@/features/categories/types'
import { productsApi } from '@/features/products/api/products.api'
import { productKeys } from '@/features/products/api/products.keys'
import { useProducts } from '@/features/products/hooks/use-products'
import { unwrap } from '@/lib/api-result'
import { roundMoney } from '@shared/money'
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

export function useImportSession() {
  const queryClient = useQueryClient()
  const { products } = useProducts()
  const { categories } = useCategories()
  const [session, setSession] = useState<ImportSession | null>(null)

  const start = async (file: File): Promise<boolean> => {
    setSession({ file, status: 'reading', invoice: null, rows: [] })
    try {
      const invoice = await extractInvoice(file)
      const rows: ImportRow[] = invoice.lines.map((line) => {
        const match = findProductByName(line.name, products)
        return {
          id: line.id,
          no: line.no,
          invoiceName: line.name,
          name: line.name,
          heading: resolveCategory(line.category, categories),
          category: resolveCategory(line.category, categories),
          qty: Math.round(line.qty),
          costPrice: roundMoney(line.costPrice),
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

  const commit = async (): Promise<ImportEntry[]> => {
    if (!session) return []
    const entries: ImportEntry[] = []
    const categoryIds = new Map(categories.map((c) => [c.name.toLowerCase(), c.id]))
    const madeProducts = new Map<string, string>()

    for (const row of session.rows.filter((r) => r.included)) {
      if (row.productId) {
        entries.push({ productId: row.productId, qty: row.qty, costPrice: row.costPrice })
        continue
      }

      const category = row.category || OTHERS_CATEGORY
      let categoryId = categoryIds.get(category.toLowerCase())
      if (!categoryId) {
        categoryId = unwrap(await categoriesApi.add(category)).id
        categoryIds.set(category.toLowerCase(), categoryId)
      }
      const key = row.name.trim().toLowerCase()
      let productId = madeProducts.get(key)
      if (!productId) {
        const product = unwrap(
          await productsApi.add({
            name: row.name.trim(),
            categoryId,
            brand: row.details.brand,
            costPrice: roundMoney(row.costPrice),
            salePrice: row.details.salePrice ?? undefined,
            stock: 0,
            reorderLevel: row.details.reorderLevel,
            shelf: row.details.shelf
          })
        )
        productId = product.id
        madeProducts.set(key, productId)
      }
      entries.push({ productId, qty: row.qty, costPrice: row.costPrice })
    }

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    ])
    return entries
  }

  return { session, start, clear, addRow, patchRow, pickProduct, pickNew, commit }
}

export type ImportSessionApi = ReturnType<typeof useImportSession>
