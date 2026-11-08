// When a product is added without a selling price, the shop adds this much on top of the cost price (15%).
// The form shows the suggestion while typing and the backend applies it when saving, so the rule lives here once.
export const DEFAULT_MARKUP = 0.15

// Money is whole Pakistani rupees (PKR). No decimals anywhere.
export function autoSalePrice(costPrice: number): number {
  return Math.round(costPrice * (1 + DEFAULT_MARKUP))
}
