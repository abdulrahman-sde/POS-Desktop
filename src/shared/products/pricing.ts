import { roundMoney } from '../money'

export const DEFAULT_MARKUP = 0.15

export const autoSalePrice = (costPrice: number): number =>
  roundMoney(costPrice * (1 + DEFAULT_MARKUP))
