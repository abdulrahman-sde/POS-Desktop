import { useState } from 'react'
import { Calendar, MoneyReceive, Wallet } from 'reicon-react'

import { usePayments } from '@/features/payments/hooks/use-payments'
import { useOrders } from '@/features/sales/hooks/use-orders'
import { useCustomers } from '@/features/customers/hooks/use-customers'
import { PageHeader } from '@/components/shared/page-header'
import { RecordPaymentDialog } from '@/components/shared/record-payment-dialog'
import { StatCard } from '@/components/shared/stat-card'
import { Button } from '@/components/ui/button'
import { useCustomerRows } from '@/features/customers/hooks/use-customer-rows'
import { PaymentsTable } from '@/features/payments/components/payments-table'
import { buildReceipts } from '@/features/payments/utils'
import { formatCurrency, isSameDay, isSameMonth } from '@/lib/format'

export function PaymentsPage(): React.JSX.Element {
  const { payments } = usePayments()
  const { orders } = useOrders()
  const { allCustomers: customers } = useCustomers()
  const rows = useCustomerRows()
  const [open, setOpen] = useState(false)

  const receipts = buildReceipts(orders, payments)
  const now = new Date()
  const today = receipts.filter((r) => isSameDay(r.date, now)).reduce((sum, r) => sum + r.amount, 0)
  const month = receipts
    .filter((r) => isSameMonth(r.date, now))
    .reduce((sum, r) => sum + r.amount, 0)
  const outstanding = rows.reduce((sum, row) => sum + Math.max(0, row.balance), 0)

  return (
    <>
      <PageHeader
        title="Payments"
        description="All the money you have received, at the counter and later."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Wallet data-icon="inline-start" />
            Receive payment
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          label="Received today"
          icon={MoneyReceive}
          tone="success"
          value={formatCurrency(today)}
        />
        <StatCard
          label="Received this month"
          icon={Calendar}
          tone="info"
          value={formatCurrency(month)}
        />
        <StatCard
          label="Customers still owe"
          icon={Wallet}
          tone="warning"
          value={formatCurrency(outstanding)}
        />
      </div>

      <PaymentsTable
        receipts={receipts}
        customerName={(id) =>
          id ? (customers.find((c) => c.id === id)?.name ?? 'Unknown') : 'Walk-in customer'
        }
      />

      <RecordPaymentDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
