import { createContext, useContext } from 'react'

import type { ImportSessionApi } from '@/features/purchases/import/hooks/use-import-session'
import type { PurchaseCart } from '@/features/purchases/hooks/use-purchase-cart'

// The Buy Stock bill and the invoice being imported. Both live above the pages, so moving between
// Buy Stock and the import page (or any other page) never loses what the owner has typed.
export type PurchaseDraft = {
  cart: PurchaseCart
  importer: ImportSessionApi
}

export const PurchaseDraftContext = createContext<PurchaseDraft | null>(null)

export function usePurchaseDraft(): PurchaseDraft {
  const value = useContext(PurchaseDraftContext)
  if (!value) throw new Error('usePurchaseDraft must be used inside <PurchaseDraftProvider>')
  return value
}
