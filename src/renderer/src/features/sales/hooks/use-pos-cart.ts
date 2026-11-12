import { useMemo, useState } from 'react'

import { isMoney, MONEY_DECIMALS_MESSAGE } from '@shared/money'
import type { NewOrderInput } from '@shared/sales/types'
import { usePayments } from '@/features/payments/hooks/use-payments'
import { useCustomers } from '@/features/customers/hooks/use-customers'
import { useProducts } from '@/features/products/hooks/use-products'
import type { Product } from '@/features/products/types'
import { toNumber } from '@/lib/format'
import type { CartItem, PaymentMethod } from '../types'
import { customerBalance, itemsSubtotal } from '../utils'
import { useOrders } from './use-orders'

export const WALK_IN = 'walk-in'

// unitPrice is the price of ONE piece for this sale. It starts at the product's usual selling price
// and the shop owner can change it on the line. The line total is qty x unitPrice.
// name is only what this invoice will say for the line; empty or missing means the product's own name.
type CartLine = { productId: string; qty: number; unitPrice: number; name?: string }

// All the state and rules of the sale screen: cart lines, customer, discount, advance.
export function usePosCart() {
  const { products } = useProducts()
  const { payments } = usePayments()
  const { orders } = useOrders()
  const { customers } = useCustomers()
  const [lines, setLines] = useState<CartLine[]>([])
  const [customerId, setCustomerId] = useState(WALK_IN)
  const [discountInput, setDiscountInput] = useState('')
  // Money received now. Starts at 0. null means "the full amount" (follows the total as items change).
  const [advanceInput, setAdvanceInput] = useState<string | null>('0')
  const [method, setMethod] = useState<PaymentMethod>('cash')

  const items: CartItem[] = useMemo(
    () =>
      lines.flatMap((line) => {
        const product = products.find((p) => p.id === line.productId)
        return product
          ? [
              {
                productId: product.id,
                name: line.name?.trim() || product.name,
                productName: product.name,
                stock: product.stock,
                qty: line.qty,
                unitPrice: line.unitPrice,
                costPrice: product.costPrice
              }
            ]
          : []
      }),
    [lines, products]
  )

  const isWalkIn = customerId === WALK_IN
  const subtotal = itemsSubtotal(items)
  const discount = Math.min(Math.max(0, toNumber(discountInput)), subtotal)
  const total = subtotal - discount
  const advance =
    advanceInput === null ? total : Math.min(Math.max(0, toNumber(advanceInput)), total)
  const due = total - advance
  const customer = customers.find((c) => c.id === customerId)
  const previousBalance = isWalkIn
    ? 0
    : customerBalance(customerId, orders, payments, customer?.openingBalance)
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0)

  const qtyInCart = (productId: string): number =>
    lines.find((line) => line.productId === productId)?.qty ?? 0

  // Returns false when there is no more stock to add.
  const addProduct = (product: Product): boolean => {
    const current = qtyInCart(product.id)
    if (current + 1 > product.stock) return false
    setLines((prev) =>
      current === 0
        ? [...prev, { productId: product.id, qty: 1, unitPrice: product.salePrice }]
        : prev.map((line) => (line.productId === product.id ? { ...line, qty: current + 1 } : line))
    )
    return true
  }

  const setQty = (productId: string, qty: number): void => {
    const product = products.find((p) => p.id === productId)
    const clamped = Math.min(qty, product?.stock ?? qty)
    if (clamped <= 0) return setLines((prev) => prev.filter((line) => line.productId !== productId))
    setLines((prev) =>
      prev.map((line) => (line.productId === productId ? { ...line, qty: clamped } : line))
    )
  }

  // Changes the price of ONE piece. It is applied on every keystroke, so the total moves as you type.
  // An empty price counts as 0 for now; the sale cannot be saved until every item has a price.
  const setUnitPrice = (productId: string, unitPrice: number): void => {
    if (!(unitPrice >= 0)) return
    setLines((prev) =>
      prev.map((line) => (line.productId === productId ? { ...line, unitPrice } : line))
    )
  }

  // Changes the name shown on the invoice for this line only. The product itself is never changed.
  const setName = (productId: string, name: string): void =>
    setLines((prev) =>
      prev.map((line) => (line.productId === productId ? { ...line, name } : line))
    )

  const removeLine = (productId: string): void =>
    setLines((prev) => prev.filter((line) => line.productId !== productId))

  const reset = (): void => {
    setLines([])
    setCustomerId(WALK_IN)
    setDiscountInput('')
    setAdvanceInput('0')
    setMethod('cash')
  }

  const selectCustomer = (id: string): void => setCustomerId(id)

  // A walk-in customer has no account, so they must pay everything now.
  const walkInMustPay = isWalkIn && due > 0 && total > 0
  const problem =
    items.length === 0
      ? 'Add at least one product.'
      : items.some((item) => item.unitPrice <= 0)
        ? 'Type a price for every item.'
        : [...items.map((item) => item.unitPrice), discount, advance].some(
              (amount) => !isMoney(amount)
            )
          ? MONEY_DECIMALS_MESSAGE
          : total <= 0
            ? 'The total must be more than zero.'
            : isWalkIn && due > 0
              ? 'Walk-in customers must pay the full amount. Tap "Full amount", or choose a customer.'
              : ''

  const buildOrder = (): NewOrderInput => ({
    customerId: isWalkIn ? null : customerId,
    items: items.map(({ productId, qty, unitPrice, name, productName }) => ({
      productId,
      qty,
      unitPrice,
      ...(name !== productName && { name })
    })),
    discount,
    advance,
    method,
    note: ''
  })

  return {
    items,
    itemCount,
    customerId,
    customer,
    isWalkIn,
    selectCustomer,
    discountInput,
    setDiscountInput,
    advanceInput,
    setAdvanceInput,
    method,
    setMethod,
    subtotal,
    discount,
    total,
    advance,
    due,
    previousBalance,
    qtyInCart,
    addProduct,
    setQty,
    setUnitPrice,
    setName,
    removeLine,
    reset,
    problem,
    walkInMustPay,
    buildOrder
  }
}

export type PosCart = ReturnType<typeof usePosCart>
