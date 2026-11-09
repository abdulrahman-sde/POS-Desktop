import { Add, Money, Receipt2, Wallet } from 'reicon-react'
import { Link } from 'react-router'

import { PageHeader } from '@/components/shared/page-header'
import { SearchField } from '@/components/shared/search-field'
import { StatCard } from '@/components/shared/stat-card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OrdersTable } from '@/features/sales/components/orders-table'
import { useOrderFilters, type OrderFilter } from '@/features/sales/hooks/use-order-filters'
import { formatCurrency, isSameDay, plural } from '@/lib/format'

export function OrdersPage(): React.JSX.Element {
  const { rows, filtered, query, setQuery, filter, setFilter } = useOrderFilters()

  const today = rows.filter((row) => isSameDay(row.order.createdAt, new Date()))
  const todayTotal = today.reduce((sum, row) => sum + row.total, 0)
  const unpaid = rows.reduce((sum, row) => sum + row.due, 0)

  return (
    <>
      <PageHeader
        title="Orders"
        actions={
          <Button nativeButton={false} render={<Link to="/sales/new" />}>
            <Add data-icon="inline-start" />
            New sale
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          label="Today's sales"
          icon={Money}
          tone="success"
          value={formatCurrency(todayTotal)}
          hint={`${plural(today.length, 'order')} today`}
        />
        <StatCard label="Total orders" icon={Receipt2} tone="primary" value={String(rows.length)} />
        <StatCard
          label="Not yet paid"
          icon={Wallet}
          tone="warning"
          value={formatCurrency(unpaid)}
        />
      </div>

      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <SearchField
          className="sm:max-w-xs sm:flex-1"
          placeholder="Search invoice or customer"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Tabs value={filter} onValueChange={(value) => setFilter(value as OrderFilter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unpaid">Not paid</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <OrdersTable rows={filtered} />
    </>
  )
}
