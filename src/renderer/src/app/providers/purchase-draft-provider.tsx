import { useImportSession } from '@/features/purchases/import/hooks/use-import-session'
import { usePurchaseCart } from '@/features/purchases/hooks/use-purchase-cart'
import { PurchaseDraftContext } from './purchase-draft-context'

export function PurchaseDraftProvider({
  children
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const cart = usePurchaseCart()
  const importer = useImportSession()
  return (
    <PurchaseDraftContext.Provider value={{ cart, importer }}>
      {children}
    </PurchaseDraftContext.Provider>
  )
}
