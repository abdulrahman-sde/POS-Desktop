import type {
  AddProductInput,
  AddStockInput,
  Product,
  UpdateProductInput
} from '@shared/products/types'
import { call } from './call'

// The products calls the screen is allowed to make. The names on the right are the backend
// routes in src/main/modules/products/products.ipc.ts.
export const productsPreload = {
  list: () => call<Product[]>('products:list'),
  add: (input: AddProductInput) => call<Product>('products:add', input),
  update: (input: UpdateProductInput) => call<Product>('products:update', input),
  remove: (id: string) => call<void>('products:remove', { id }),
  addStock: (input: AddStockInput) => call<Product>('products:addStock', input)
}
