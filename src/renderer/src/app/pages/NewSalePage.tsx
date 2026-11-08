import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

import { useInvoiceViewer } from '@/app/providers/invoice-viewer-context'
import { Card } from '@/components/ui/card'
import { PosCartLines } from '@/features/sales/components/pos-cart-lines'
import { PosCheckout } from '@/features/sales/components/pos-checkout'
import { PosProductPicker } from '@/features/sales/components/pos-product-picker'
import { useCreateOrder } from '@/features/sales/hooks/use-order-mutations'
import { usePosCart } from '@/features/sales/hooks/use-pos-cart'

export function NewSalePage(): React.JSX.Element {
  const cart = usePosCart()
  const createOrder = useCreateOrder()
  const { openInvoice } = useInvoiceViewer()
  const searchRef = useRef<HTMLInputElement>(null)
  const submitRef = useRef<() => void>(() => {})

  const submit = async (): Promise<void> => {
    if (createOrder.isPending) return
    if (cart.problem) {
      toast.error(cart.problem)
      return
    }
    try {
      const order = await createOrder.mutateAsync(cart.buildOrder())
      cart.reset()
      toast.success(`Invoice ${order.invoiceNo} created`)
      openInvoice(order.id)
    } catch (error) {
      toast.error((error as Error).message)
    }
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
        <div className="min-h-0 flex-1 overflow-auto">
          <PosCartLines cart={cart} />
        </div>
        <PosCheckout cart={cart} onSubmit={submit} />
      </Card>
    </div>
  )
}
