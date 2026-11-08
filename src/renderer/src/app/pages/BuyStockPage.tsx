import { toast } from 'sonner'

import { usePurchaseDraft } from '@/app/providers/purchase-draft-context'
import { useData } from '@/app/providers/data-context'
import { ImportInvoiceButton } from '@/features/purchases/import/components/import-invoice-button'
import { PageHeader } from '@/components/shared/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PurchaseCheckout } from '@/features/purchases/components/purchase-checkout'
import { PurchaseLines } from '@/features/purchases/components/purchase-lines'
import { PurchaseProductSearch } from '@/features/purchases/components/purchase-product-search'
import { plural } from '@/lib/format'

export function BuyStockPage(): React.JSX.Element {
  const { cart } = usePurchaseDraft()
  const { createPurchase } = useData()

  const submit = (): void => {
    if (cart.problem) {
      toast.error(cart.problem)
      return
    }
    const purchase = createPurchase(cart.buildPurchase())
    cart.reset()
    toast.success(`${purchase.billNo} saved. Your stock is updated.`)
  }

  return (
    <div className="flex flex-col gap-4 md:h-full">
      <PageHeader
        title="Buy stock"
        description="Type what your supplier sent you, or import their invoice. Your stock updates when you save."
        actions={<ImportInvoiceButton />}
      />

      {/* Stacked on small screens; two panes side by side from tablet width up */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 md:flex-row">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
          <PurchaseProductSearch onAdd={cart.addProduct} />
          <Card className="min-h-0 flex-1 gap-0 overflow-auto py-0">
            <div className="flex flex-col gap-0.5 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Supplier bill</span>
                  {cart.itemCount > 0 ? (
                    <Badge variant="secondary">{plural(cart.itemCount, 'item')}</Badge>
                  ) : null}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={cart.items.length === 0}
                  onClick={cart.reset}
                >
                  Clear
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Type the quantity and the cost price of each piece.
              </p>
            </div>
            <div className="border-t">
              <PurchaseLines cart={cart} />
            </div>
          </Card>
        </div>

        <Card className="h-fit gap-0 py-0 md:w-84 lg:w-90">
          <PurchaseCheckout cart={cart} onSubmit={submit} />
        </Card>
      </div>
    </div>
  )
}
