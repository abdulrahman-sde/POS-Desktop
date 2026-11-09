import { useState } from 'react'
import { Printer, Wallet } from 'reicon-react'

import { useSettings } from '@/features/settings/hooks/use-settings'
import { usePayments } from '@/features/payments/hooks/use-payments'
import { useInvoices } from '@/features/sales/hooks/use-invoices'
import { useOrders } from '@/features/sales/hooks/use-orders'
import { useCustomers } from '@/features/customers/hooks/use-customers'
import { InvoiceStatusBadge } from '@/components/shared/invoice-status-badge'
import { RecordPaymentDialog } from '@/components/shared/record-payment-dialog'
import { WhatsAppButton } from '@/components/shared/whatsapp-button'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { customerBalance } from '@/features/sales/utils'
import { buildInvoiceMessage } from '../utils'
import { InvoiceDocument } from './invoice-document'
import { InvoicePrint } from './invoice-print'

type InvoiceDialogProps = {
  orderId: string | null
  onClose: () => void
}

export function InvoiceDialog({ orderId, onClose }: InvoiceDialogProps): React.JSX.Element {
  return (
    <Dialog open={orderId !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-11/12 flex-col sm:max-w-2xl">
        {orderId ? <InvoiceBody orderId={orderId} onClose={onClose} /> : null}
      </DialogContent>
    </Dialog>
  )
}

function InvoiceBody({
  orderId,
  onClose
}: {
  orderId: string
  onClose: () => void
}): React.JSX.Element {
  const { settings } = useSettings()
  const { payments } = usePayments()
  const { orders } = useOrders()
  const invoices = useInvoices()
  const { allCustomers: customers } = useCustomers()
  const [paymentOpen, setPaymentOpen] = useState(false)

  const order = orders.find((item) => item.id === orderId)
  const summary = invoices.get(orderId)
  if (!order || !summary) {
    return (
      <DialogHeader>
        <DialogTitle>Invoice not found</DialogTitle>
        <DialogDescription>This invoice no longer exists.</DialogDescription>
      </DialogHeader>
    )
  }

  const customer = customers.find((item) => item.id === order.customerId)
  const totalBalance = customer
    ? customerBalance(customer.id, orders, payments, customer.openingBalance)
    : 0
  const message = buildInvoiceMessage(order, summary, customer, totalBalance, settings)

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          Invoice {order.invoiceNo}
          <InvoiceStatusBadge status={summary.status} />
        </DialogTitle>
        {customer ? null : (
          <DialogDescription>Walk-in sale: no phone number to send this to.</DialogDescription>
        )}
      </DialogHeader>

      {/* Only the invoice scrolls; the title and the buttons stay in view. */}
      <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border bg-background p-4 sm:p-6">
        <InvoiceDocument order={order} summary={summary} customer={customer} settings={settings} />
      </div>

      <DialogFooter className="sm:flex-wrap">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          <Printer data-icon="inline-start" />
          Print
        </Button>
        <WhatsAppButton phone={customer?.phone} message={message} />
        {summary.due > 0 && customer ? (
          <Button onClick={() => setPaymentOpen(true)}>
            <Wallet data-icon="inline-start" />
            Receive payment
          </Button>
        ) : null}
      </DialogFooter>

      <InvoicePrint order={order} summary={summary} customer={customer} settings={settings} />
      {customer ? (
        <RecordPaymentDialog
          open={paymentOpen}
          onOpenChange={setPaymentOpen}
          customerId={customer.id}
        />
      ) : null}
    </>
  )
}
