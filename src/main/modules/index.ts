import { registerCategoriesIpc } from './categories/categories.ipc'
import { registerCustomersIpc } from './customers/customers.ipc'
import { registerPaymentsIpc } from './payments/payments.ipc'
import { registerProductsIpc } from './products/products.ipc'
import { registerPurchasesIpc } from './purchases/purchases.ipc'
import { registerSalesIpc } from './sales/sales.ipc'
import { registerSuppliersIpc } from './suppliers/suppliers.ipc'

export function registerAllIpc(): void {
  registerCategoriesIpc()
  registerCustomersIpc()
  registerPaymentsIpc()
  registerProductsIpc()
  registerPurchasesIpc()
  registerSalesIpc()
  registerSuppliersIpc()
}
