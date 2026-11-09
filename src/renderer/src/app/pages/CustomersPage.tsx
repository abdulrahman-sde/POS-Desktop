import { useMemo, useState } from 'react'
import { Add, User, Users, Wallet } from 'reicon-react'
import { useNavigate } from 'react-router'

import { PageHeader } from '@/components/shared/page-header'
import { SearchField } from '@/components/shared/search-field'
import { StatCard } from '@/components/shared/stat-card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CustomerFormDialog } from '@/features/customers/components/customer-form-dialog'
import { CustomersTable } from '@/features/customers/components/customers-table'
import { useCustomerRows } from '@/features/customers/hooks/use-customer-rows'
import { formatCurrency } from '@/lib/format'

export function CustomersPage(): React.JSX.Element {
  const rows = useCustomerRows()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'owing'>('all')
  const [formOpen, setFormOpen] = useState(false)

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase()
    return rows
      .filter((row) => filter === 'all' || row.balance > 0)
      .filter(
        (row) =>
          !text ||
          row.customer.name.toLowerCase().includes(text) ||
          row.customer.phone.replace(/\s/g, '').includes(text.replace(/\s/g, ''))
      )
      .sort((a, b) => b.balance - a.balance)
  }, [rows, query, filter])

  const totalOwed = rows.reduce((sum, row) => sum + Math.max(0, row.balance), 0)
  const owingCount = rows.filter((row) => row.balance > 0).length

  return (
    <>
      <PageHeader
        title="Customers"
        actions={
          <Button onClick={() => setFormOpen(true)}>
            <Add data-icon="inline-start" />
            Add customer
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Customers" icon={Users} tone="primary" value={String(rows.length)} />
        <StatCard
          label="Customers owe you"
          icon={Wallet}
          tone="warning"
          value={formatCurrency(totalOwed)}
        />
        <StatCard
          label="Customers who owe"
          icon={User}
          tone="destructive"
          value={String(owingCount)}
        />
      </div>

      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <SearchField
          className="sm:max-w-xs sm:flex-1"
          placeholder="Search name or phone"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Tabs value={filter} onValueChange={(value) => setFilter(value as 'all' | 'owing')}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="owing">Owes money</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <CustomersTable rows={visible} />

      <CustomerFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSaved={(customer) => navigate(`/customers/${customer.id}`)}
      />
    </>
  )
}
