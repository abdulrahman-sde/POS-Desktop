import { useState } from 'react'

import { InvoiceDialog } from '@/features/invoices/components/invoice-dialog'
import { InvoiceViewerContext } from './invoice-viewer-context'

// Keeps track of which invoice is open and renders the one shared invoice modal.
export function InvoiceViewerProvider({
  children
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const [orderId, setOrderId] = useState<string | null>(null)

  return (
    <InvoiceViewerContext.Provider value={{ openInvoice: setOrderId }}>
      {children}
      <InvoiceDialog orderId={orderId} onClose={() => setOrderId(null)} />
    </InvoiceViewerContext.Provider>
  )
}
