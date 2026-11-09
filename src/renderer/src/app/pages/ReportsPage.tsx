import { ChartBar, GraphUp, Money, Receipt2 } from 'reicon-react'
import { useState } from 'react'

import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SalesLineChart } from '@/features/reports/components/sales-line-chart'
import { TopProductsCard } from '@/features/reports/components/top-products-card'
import { useReport, type ReportRange } from '@/features/reports/hooks/use-report'
import { formatCurrency } from '@/lib/format'

export function ReportsPage(): React.JSX.Element {
  const [range, setRange] = useState<ReportRange>(7)
  const report = useReport(range)

  return (
    <>
      <PageHeader
        title="Reports"
        actions={
          <Tabs
            value={String(range)}
            onValueChange={(value) => setRange(Number(value) as ReportRange)}
          >
            <TabsList>
              <TabsTrigger value="7">Last 7 days</TabsTrigger>
              <TabsTrigger value="30">Last 30 days</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Sold" icon={Money} tone="success" value={formatCurrency(report.sales)} />
        <StatCard
          label="Profit"
          icon={GraphUp}
          tone="success"
          value={formatCurrency(report.profit)}
        />
        <StatCard label="Orders" icon={Receipt2} tone="primary" value={String(report.orderCount)} />
        <StatCard
          label="Average sale"
          icon={ChartBar}
          tone="info"
          value={formatCurrency(report.orderCount > 0 ? report.sales / report.orderCount : 0)}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesLineChart days={report.days} />
        </div>
        <TopProductsCard products={report.topProducts} />
      </div>
    </>
  )
}
