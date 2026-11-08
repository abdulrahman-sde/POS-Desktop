// When a product is added without a selling price, the shop adds this much on top of the cost price (15%).
export const DEFAULT_MARKUP = 0.15

export function autoSalePrice(costPrice: number): number {
  return Math.round(costPrice * (1 + DEFAULT_MARKUP))
}

// The fields a new product gets when the owner does not fill them in. Used by the Add product form and the invoice importer.
export function newProductExtras(category: string): {
  unit: string
  compatibleModels: string
  color: string
  warranty: string
  barcode: string
  sku: string
} {
  return {
    unit: 'pcs',
    compatibleModels: '',
    color: '',
    warranty: '',
    barcode: '',
    // An item code is made for you from the category and the time.
    sku: `${category.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-5)}`
  }
}
