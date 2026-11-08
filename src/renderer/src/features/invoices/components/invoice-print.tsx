import { createPortal } from 'react-dom'

import { InvoiceDocument } from './invoice-document'

// Printing: this copy of the invoice is placed directly in <body>, hidden on screen and
// shown only when printing. Everything else in <body> (the app and the open modal) is hidden by a print rule in index.css.
export function InvoicePrint(
  props: React.ComponentProps<typeof InvoiceDocument>
): React.ReactPortal {
  return createPortal(
    <div data-print-invoice className="hidden bg-background p-8 print:block">
      <InvoiceDocument {...props} />
    </div>,
    document.body
  )
}
