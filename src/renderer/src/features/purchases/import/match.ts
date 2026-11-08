import type { Product } from '@/features/products/types'

// Matching an invoice item to one of your products is deliberately plain: the names must be the same, and only capital
// letters are ignored ("samsung a12" = "Samsung A12"). There is no guessing and no "similar" match. An item that is not
// the same is a new product, and the owner can switch it to an existing product by hand.
export const sameName = (a: string, b: string): boolean =>
  a.trim().toLowerCase() === b.trim().toLowerCase()

export const findProductByName = (name: string, products: Product[]): Product | undefined =>
  products.find((product) => sameName(product.name, name))
