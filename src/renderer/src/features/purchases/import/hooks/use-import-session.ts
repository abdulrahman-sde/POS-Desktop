import { useState } from 'react'
import { toast } from 'sonner'

import { useCategories } from '@/features/categories/hooks/use-categories'
import { OTHERS_CATEGORY } from '@/features/categories/types'
import { useProducts } from '@/features/products/hooks/use-products'
import { useSettings } from '@/features/settings/hooks/use-settings'
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
  const { products } = useProducts()
  const { categories } = useCategories()
  const { settings } = useSettings()
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
          details: {
            brand: '',
            salePrice: null,
            reorderLevel: settings.defaultReorderLevel,
            shelf: ''
          }
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
                details: {
                  brand: '',
                  salePrice: null,
                  reorderLevel: settings.defaultReorderLevel,
                  shelf: ''
                }
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

  // Only reads the rows. Nothing is created here: a new product is made when the bill is saved, together with the bill.
  const commit = (): ImportEntry[] => {
    if (!session) return []
    return session.rows
      .filter((row) => row.included)
      .map((row): ImportEntry => {
        const base = { name: row.name.trim(), qty: row.qty, costPrice: roundMoney(row.costPrice) }
        if (row.productId) return { ...base, productId: row.productId }
        return {
          ...base,
          newProduct: {
            name: base.name,
            category: row.category || OTHERS_CATEGORY,
            brand: row.details.brand,
            salePrice: row.details.salePrice ?? undefined,
            reorderLevel: row.details.reorderLevel,
            shelf: row.details.shelf
          }
        }
      })
  }

  return { session, start, clear, addRow, patchRow, pickProduct, pickNew, commit }
}

export type ImportSessionApi = ReturnType<typeof useImportSession>
