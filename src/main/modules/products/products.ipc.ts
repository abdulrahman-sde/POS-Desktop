import { addProductSchema, addStockSchema, updateProductSchema } from '@shared/products/schema'
import { handle } from '../../lib/ipc'
import * as service from './products.service'

// The routes (endpoints) of the products module. The renderer reaches them through
// preload/modules/products.ts. To see everything products can do, read this file.
export function registerProductsIpc(): void {
  handle('products:list', null, () => service.listProducts())
  handle('products:add', addProductSchema, (input) => service.addProduct(input))
  handle('products:update', updateProductSchema, (input) => service.updateProduct(input))
  handle('products:addStock', addStockSchema, (input) => service.addStock(input))
}
