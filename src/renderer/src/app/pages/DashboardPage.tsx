import { Add, Calendar, Money, Wallet, Warning } from 'reicon-react'
import { Link } from 'react-router'

import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { Button } from '@/components/ui/button'
import { CustomersOwingCard } from '@/features/dashboard/components/customers-owing-card'
import { LowStockCard } from '@/features/dashboard/components/low-stock-card'
import { RecentOrdersCard } from '@/features/dashboard/components/recent-orders-card'
import { useDashboardStats } from '@/features/dashboard/hooks/use-dashboard-stats'
import { formatCurrency, plural } from '@/lib/format'

export function DashboardPage(): React.JSX.Element {
  const stats = useDashboardStats()

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="How your shop is doing today."
        actions={
          <Button nativeButton={false} render={<Link to="/sales/new" />}>
            <Add data-icon="inline-start" />
            New sale
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Sold today"
          icon={Money}
          tone="success"
          value={formatCurrency(stats.todaySales)}
          hint={plural(stats.todayCount, 'sale')}
        />
        <StatCard
          label="Money to collect"
          icon={Wallet}
          tone="warning"
          value={formatCurrency(stats.toReceive)}
          hint={`from ${plural(stats.owingCount, 'customer')}`}
        />
        <StatCard
          label="Running low"
          icon={Warning}
          tone="destructive"
          value={String(stats.lowStock.length)}
          hint="Items to buy more of"
        />
        <StatCard
          label="Sold this month"
          icon={Calendar}
          tone="info"
          value={formatCurrency(stats.monthSales)}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentOrdersCard rows={stats.recentOrders} />
        </div>
        <div className="flex flex-col gap-4">
          <CustomersOwingCard rows={stats.topOwing} />
          <LowStockCard products={stats.lowStock} />
        </div>
      </div>
    </>
  )
}
