import { roundMoney } from '@shared/money'
import type { Purchase, PurchaseItem, SupplierPayment } from './types'

export function purchaseSubtotal(items: PurchaseItem[]): number {
  return roundMoney(items.reduce((sum, item) => sum + item.qty * item.costPrice, 0))
}

// What you still owe the supplier: what you already owed before using the app, plus all their bills,
// minus everything you have paid them.
export function supplierOwed(
  supplierId: string,
  purchases: Purchase[],
  payments: SupplierPayment[],
  openingBalance = 0
): number {
  const billed = purchases
    .filter((purchase) => purchase.supplierId === supplierId)
    .reduce((sum, purchase) => sum + purchaseSubtotal(purchase.items) - purchase.paid, 0)
  const paid = payments
    .filter((payment) => payment.supplierId === supplierId)
    .reduce((sum, payment) => sum + payment.amount, 0)
  return roundMoney(openingBalance + billed - paid)
}
