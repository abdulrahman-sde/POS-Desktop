import { registerCategoriesIpc } from './categories/categories.ipc'
import { registerCustomersIpc } from './customers/customers.ipc'
import { registerProductsIpc } from './products/products.ipc'
import { registerSuppliersIpc } from './suppliers/suppliers.ipc'

export function registerAllIpc(): void {
  registerCategoriesIpc()
  registerCustomersIpc()
  registerProductsIpc()
  registerSuppliersIpc()
}
