import { registerCategoriesIpc } from './categories/categories.ipc'
import { registerProductsIpc } from './products/products.ipc'

// Turns on every backend route. Add a line here when you add a module.
export function registerAllIpc(): void {
  registerCategoriesIpc()
  registerProductsIpc()
}
