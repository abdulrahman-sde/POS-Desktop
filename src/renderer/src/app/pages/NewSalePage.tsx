import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

import { useData } from '@/app/providers/data-context'
import { useInvoiceViewer } from '@/app/providers/invoice-viewer-context'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { plural } from '@/lib/format'
import { PosCartLines } from '@/features/sales/components/pos-cart-lines'
import { PosCheckout } from '@/features/sales/components/pos-checkout'
import { PosProductPicker } from '@/features/sales/components/pos-product-picker'
import { usePosCart } from '@/features/sales/hooks/use-pos-cart'

export function NewSalePage(): React.JSX.Element {
  const cart = usePosCart()
  const { createOrder } = useData()
  const { openInvoice } = useInvoiceViewer()
  const searchRef = useRef<HTMLInputElement>(null)
  const submitRef = useRef<() => void>(() => {})

  const submit = (): void => {
    if (cart.problem) {
      toast.error(cart.problem)
      return
    }
    const order = createOrder(cart.buildOrder())
    cart.reset()
    toast.success(`Invoice ${order.invoiceNo} created`)
    openInvoice(order.id)
  }

  useEffect(() => {
    submitRef.current = submit
  })

  // Keyboard shortcuts: "/" jumps to the search box, Ctrl/Cmd + Enter creates the invoice.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      const target = event.target as HTMLElement
      const typing = ['INPUT', 'TEXTAREA'].includes(target.tagName)
      if (event.key === '/' && !typing) {
        event.preventDefault()
        searchRef.current?.focus()
      }
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault()
        submitRef.current()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    // Stacked on very small screens; two panes side by side from tablet width up (each pane scrolls on its own).
    <div className="flex flex-col gap-4 md:h-full md:flex-row">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <PosProductPicker
          searchRef={searchRef}
          qtyInCart={cart.qtyInCart}
          onAdd={cart.addProduct}
        />
      </div>

      <Card className="min-h-0 gap-0 py-0 md:w-84 lg:w-90">
        <div className="flex flex-col gap-0.5 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Current sale</span>
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
            Change the quantity or the sale price if needed.
          </p>
        </div>
        <div className="min-h-0 flex-1 overflow-auto border-t">
          <PosCartLines cart={cart} />
        </div>
        <PosCheckout cart={cart} onSubmit={submit} />
      </Card>
    </div>
  )
}
