import { useMemo, useState } from 'react'

import { isMoney, MONEY_DECIMALS_MESSAGE } from '@shared/money'
import type { NewPurchaseInput } from '@shared/purchases/types'
import { useSuppliers } from '@/features/suppliers/hooks/use-suppliers'
import { useProducts } from '@/features/products/hooks/use-products'
import type { Product } from '@/features/products/types'
import type { PaymentMethod } from '@/features/sales/types'
import { toNumber } from '@/lib/format'
import type { PurchaseItem } from '../types'
import { purchaseSubtotal, supplierOwed } from '../utils'
import { usePurchases } from './use-purchases'
import { useSupplierPayments } from './use-supplier-payments'

// cost is the price of ONE piece on this bill. It starts at the product's current cost price.
type Line = { productId: string; qty: number; costPrice: number }

// All the state and rules of the Buy Stock screen: the bill lines, the supplier, and the money paid.
export function usePurchaseCart() {
  const { products } = useProducts()
  const { suppliers } = useSuppliers()
  const { purchases } = usePurchases()
  const { supplierPayments } = useSupplierPayments()
  const [lines, setLines] = useState<Line[]>([])
  const [pickedSupplierId, setSupplierId] = useState('')
  const supplierId = pickedSupplierId || suppliers[0]?.id || ''
  // Money paid to the supplier now. Starts at 0. null means "the full amount".
  const [paidInput, setPaidInput] = useState<string | null>('0')
  const [method, setMethod] = useState<PaymentMethod>('cash')

  const items: PurchaseItem[] = useMemo(
    () =>
      lines.flatMap((line) => {
        const product = products.find((p) => p.id === line.productId)
        return product
          ? [
              {
                productId: product.id,
                name: product.name,
                qty: line.qty,
                costPrice: line.costPrice
              }
            ]
          : []
      }),
    [lines, products]
  )

  const total = purchaseSubtotal(items)
  const paid = paidInput === null ? total : Math.min(Math.max(0, toNumber(paidInput)), total)
  const due = total - paid
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0)
  const alreadyOwed = supplierId ? supplierOwed(supplierId, purchases, supplierPayments) : 0

  // Adding a product that is already on the bill adds one more piece, so it never appears twice.
  const addProduct = (product: Product): void =>
    setLines((prev) =>
      prev.some((line) => line.productId === product.id)
        ? prev.map((line) =>
            line.productId === product.id ? { ...line, qty: line.qty + 1 } : line
          )
        : [...prev, { productId: product.id, qty: 1, costPrice: product.costPrice }]
    )

  // Adds many lines at once (from an imported invoice). A product already on the bill gets the new quantity added to it.
  const addLines = (entries: { productId: string; qty: number; costPrice: number }[]): void =>
    setLines((prev) => {
      const next = [...prev]
      for (const entry of entries) {
        const at = next.findIndex((line) => line.productId === entry.productId)
        if (at >= 0)
          next[at] = { ...next[at], qty: next[at].qty + entry.qty, costPrice: entry.costPrice }
        else next.push(entry)
      }
      return next
    })

  const setQty = (productId: string, qty: number): void =>
    setLines((prev) =>
      qty <= 0
        ? prev.filter((line) => line.productId !== productId)
        : prev.map((line) => (line.productId === productId ? { ...line, qty } : line))
    )

  // Applied on every keystroke. An empty cost counts as 0 for now; the bill cannot be saved until every item has one.
  const setCost = (productId: string, costPrice: number): void => {
    if (!(costPrice >= 0)) return
    setLines((prev) =>
      prev.map((line) => (line.productId === productId ? { ...line, costPrice } : line))
    )
  }

  const removeLine = (productId: string): void =>
    setLines((prev) => prev.filter((line) => line.productId !== productId))

  const reset = (): void => {
    setLines([])
    setPaidInput('0')
    setMethod('cash')
  }

  const problem = !supplierId
    ? 'Choose a supplier.'
    : items.length === 0
      ? 'Add at least one product.'
      : items.some((item) => item.costPrice <= 0)
        ? 'Type the cost for every item.'
        : items.some((item) => !Number.isInteger(item.qty))
          ? 'Use whole numbers for the quantity.'
          : items.some((item) => !isMoney(item.costPrice)) || !isMoney(paid)
            ? MONEY_DECIMALS_MESSAGE
            : total <= 0
              ? 'The total must be more than zero.'
              : ''

  const buildPurchase = (): NewPurchaseInput => ({
    supplierId,
    items: items.map(({ productId, qty, costPrice }) => ({ productId, qty, costPrice })),
    paid,
    method,
    note: ''
  })

  return {
    items,
    itemCount,
    supplierId,
    setSupplierId,
    paidInput,
    setPaidInput,
    method,
    setMethod,
    total,
    paid,
    due,
    alreadyOwed,
    addProduct,
    addLines,
    setQty,
    setCost,
    removeLine,
    reset,
    problem,
    buildPurchase
  }
}

export type PurchaseCart = ReturnType<typeof usePurchaseCart>
