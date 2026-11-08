import { useState } from 'react'
import { AngleLeft, Edit, Receipt, TickCircle, Trash, Users, Wallet } from 'reicon-react'
import { Link, useNavigate, useParams } from 'react-router'

import { useData } from '@/app/providers/data-context'
import { useCustomers } from '@/features/customers/hooks/use-customers'
import { BalanceAmount } from '@/components/shared/balance-amount'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { RecordPaymentDialog } from '@/components/shared/record-payment-dialog'
import { StatCard, toneClasses } from '@/components/shared/stat-card'
import { WhatsAppButton } from '@/components/shared/whatsapp-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CustomerDeleteDialog } from '@/features/customers/components/customer-delete-dialog'
import { CustomerFormDialog } from '@/features/customers/components/customer-form-dialog'
import { CustomerLedgerTable } from '@/features/customers/components/customer-ledger-table'
import { buildLedger, buildReminderMessage } from '@/features/customers/utils'
import { customerBalance } from '@/features/sales/utils'
import { formatCurrency, plural } from '@/lib/format'
import { cn } from '@/lib/utils'

export function CustomerDetailPage(): React.JSX.Element {
  const { id } = useParams()
  const { orders, payments, invoices, settings } = useData()
  const { customers, isLoading } = useCustomers()
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const navigate = useNavigate()

  const customer = customers.find((item) => item.id === id)
  if (isLoading) return <></>
  if (!customer) {
    return (
      <EmptyState
        icon={Users}
        title="Customer not found"
        action={
          <Button variant="outline" nativeButton={false} render={<Link to="/customers" />}>
            Back to customers
          </Button>
        }
      />
    )
  }

  const owed = customerBalance(customer.id, orders, payments)
  const ledger = buildLedger(customer.id, orders, payments)
  const bought = ledger.reduce((sum, entry) => sum + entry.bill, 0)
  const received = ledger.reduce((sum, entry) => sum + entry.received, 0)
  const unpaidCount = orders.filter(
    (order) => order.customerId === customer.id && (invoices.get(order.id)?.due ?? 0) > 0
  ).length

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="mb-2"
        nativeButton={false}
        render={<Link to="/customers" />}
      >
        <AngleLeft data-icon="inline-start" />
        Customers
      </Button>

      <PageHeader
        title={customer.name}
        description={
          [customer.phone, customer.address].filter(Boolean).join(' · ') ||
          'No phone or address saved'
        }
        actions={
          <>
            <Button onClick={() => setPaymentOpen(true)}>
              <Wallet data-icon="inline-start" />
              Receive payment
            </Button>
            {owed > 0 ? (
              <WhatsAppButton
                phone={customer.phone}
                message={buildReminderMessage(customer, owed, settings)}
                label="Remind on WhatsApp"
              />
            ) : null}
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Edit data-icon="inline-start" />
              Edit
            </Button>
            <Button
              variant="outline"
              disabled={owed > 0}
              title={
                owed > 0 ? 'This customer still owes you money. Receive payment first.' : undefined
              }
              onClick={() => setDeleteOpen(true)}
            >
              <Trash data-icon="inline-start" />
              Delete
            </Button>
          </>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card size="sm">
          <CardContent className="flex items-center gap-3">
            <div
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-lg',
                toneClasses[owed > 0 ? 'destructive' : 'success']
              )}
            >
              <Wallet className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Owes you</span>
              <span className="text-xl">
                <BalanceAmount amount={owed} />
              </span>
              <span className="text-xs text-muted-foreground">
                {unpaidCount > 0
                  ? plural(unpaidCount, 'invoice') + ' not fully paid'
                  : 'Nothing pending'}
              </span>
            </div>
          </CardContent>
        </Card>
        <StatCard label="Total bought" icon={Receipt} tone="info" value={formatCurrency(bought)} />
        <StatCard
          label="Money received"
          icon={TickCircle}
          tone="success"
          value={formatCurrency(received)}
        />
      </div>

      <h2 className="text-sm text-muted-foreground">All invoices and payments</h2>
      <p className="mb-2 text-xs text-muted-foreground">
        "Total owed" is everything he owed you after that line. The top line is what he owes you
        today.
      </p>
      <CustomerLedgerTable entries={ledger} />

      {customer.notes ? (
        <p className="mt-3 text-sm text-muted-foreground">Note: {customer.notes}</p>
      ) : null}

      <RecordPaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        customerId={customer.id}
      />
      <CustomerFormDialog open={editOpen} onOpenChange={setEditOpen} customer={customer} />
      <CustomerDeleteDialog
        customer={customer}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={() => navigate('/customers')}
      />
    </>
  )
}
