import type { AddProductInput, AddStockInput, UpdateProductInput } from '@shared/products/types'

// The ONLY file that calls window.api.products.*. It sends the request and gives back the raw
// answer: checking it is done by the hooks (useApiQuery / useApiMutation).
// The backend routes behind these are listed in src/main/modules/products/products.ipc.ts.
export const productsApi = {
  list: () => window.api.products.list(),
  add: (input: AddProductInput) => window.api.products.add(input),
  update: (input: UpdateProductInput) => window.api.products.update(input),
  remove: (id: string) => window.api.products.remove(id),
  addStock: (input: AddStockInput) => window.api.products.addStock(input)
}
