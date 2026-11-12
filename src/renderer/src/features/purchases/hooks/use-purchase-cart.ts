import { useMemo, useState } from 'react'

import { isMoney, MONEY_DECIMALS_MESSAGE } from '@shared/money'
import type { NewBillProduct, NewPurchaseInput } from '@shared/purchases/types'
import { useSuppliers } from '@/features/suppliers/hooks/use-suppliers'
import { useProducts } from '@/features/products/hooks/use-products'
import type { Product } from '@/features/products/types'
import type { PaymentMethod } from '@/features/sales/types'
import { toNumber } from '@/lib/format'
import { sameName } from '../import/match'
import type { ImportEntry } from '../import/types'
import type { PurchaseItem } from '../types'
import { purchaseSubtotal, supplierOwed } from '../utils'
import { usePurchases } from './use-purchases'
import { useSupplierPayments } from './use-supplier-payments'

// cost is the price of ONE piece on this bill. It starts at the product's current cost price.
// key is the product's id, or for a new product (from an imported invoice, made when the bill is saved) a made-up key.
type Line = { key: string; newProduct?: NewBillProduct; qty: number; costPrice: number }

const newKey = (name: string): string => `new:${name.trim().toLowerCase()}`

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
        if (line.newProduct) {
          return [
            {
              productId: line.key,
              name: line.newProduct.name,
              qty: line.qty,
              costPrice: line.costPrice,
              isNew: true
            }
          ]
        }
        const product = products.find((p) => p.id === line.key)
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
  const alreadyOwed = supplierId
    ? supplierOwed(
        supplierId,
        purchases,
        supplierPayments,
        suppliers.find((s) => s.id === supplierId)?.openingBalance
      )
    : 0

  // Puts a product on the bill. One already there gets the quantity added, so it never appears twice. A new-product
  // line with the same name (now that the product exists) is folded into it.
  const put = (
    prev: Line[],
    product: { id: string; name: string },
    qty: number,
    costPrice: number,
    replaceCost: boolean
  ): Line[] => {
    let total = qty
    const rest = prev.filter((line) => {
      if (line.newProduct && sameName(line.newProduct.name, product.name)) {
        total += line.qty
        return false
      }
      return true
    })
    const at = rest.findIndex((line) => line.key === product.id)
    if (at < 0) return [...rest, { key: product.id, qty: total, costPrice }]
    return rest.map((line, i) =>
      i === at
        ? { ...line, qty: line.qty + total, costPrice: replaceCost ? costPrice : line.costPrice }
        : line
    )
  }

  const addProduct = (product: Product): void =>
    setLines((prev) => put(prev, product, 1, product.costPrice, false))

  // Adds many lines at once (from an imported invoice). A product already on the bill gets the new quantity added to it.
  const addLines = (entries: ImportEntry[]): void =>
    setLines((prev) => {
      let next = prev
      for (const entry of entries) {
        // A "new" item whose name has become one of your products meanwhile is that product.
        const known = entry.productId
          ? { id: entry.productId, name: entry.name }
          : products.find((p) => sameName(p.name, entry.name))
        if (known) {
          next = put(next, known, entry.qty, entry.costPrice, true)
          continue
        }
        const key = newKey(entry.name)
        const at = next.findIndex((line) => line.key === key)
        next =
          at >= 0
            ? next.map((line, i) =>
                i === at ? { ...line, qty: line.qty + entry.qty, costPrice: entry.costPrice } : line
              )
            : [
                ...next,
                { key, newProduct: entry.newProduct, qty: entry.qty, costPrice: entry.costPrice }
              ]
      }
      return next
    })

  const setQty = (key: string, qty: number): void =>
    setLines((prev) =>
      qty <= 0
        ? prev.filter((line) => line.key !== key)
        : prev.map((line) => (line.key === key ? { ...line, qty } : line))
    )

  // Applied on every keystroke. An empty cost counts as 0 for now; the bill cannot be saved until every item has one.
  const setCost = (key: string, costPrice: number): void => {
    if (!(costPrice >= 0)) return
    setLines((prev) => prev.map((line) => (line.key === key ? { ...line, costPrice } : line)))
  }

  const removeLine = (key: string): void =>
    setLines((prev) => prev.filter((line) => line.key !== key))

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
    items: items.map(({ productId, qty, costPrice }) => {
      const newProduct = lines.find((line) => line.key === productId)?.newProduct
      return newProduct ? { newProduct, qty, costPrice } : { productId, qty, costPrice }
    }),
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
