import { createContext, useContext } from 'react'

export type InvoiceViewerValue = {
  // Opens the invoice in a modal on top of whatever screen you are on.
  openInvoice: (orderId: string) => void
}

export const InvoiceViewerContext = createContext<InvoiceViewerValue | null>(null)

export function useInvoiceViewer(): InvoiceViewerValue {
  const value = useContext(InvoiceViewerContext)
  if (!value) throw new Error('useInvoiceViewer must be used inside <InvoiceViewerProvider>')
  return value
}
