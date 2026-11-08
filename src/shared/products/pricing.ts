import { DEFAULT_SETTINGS } from '../settings/constants'
import { roundMoney } from '../money'

export const autoSalePrice = (
  costPrice: number,
  markupPercent: number = DEFAULT_SETTINGS.defaultMarkupPercent
): number => roundMoney(costPrice * (1 + markupPercent / 100))
