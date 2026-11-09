import { useMemo, useState } from 'react'
import { Add, Cart, Shop, Wallet } from 'reicon-react'
import { Link } from 'react-router'

import { PageHeader } from '@/components/shared/page-header'
import { SearchField } from '@/components/shared/search-field'
import { StatCard } from '@/components/shared/stat-card'
import { Button } from '@/components/ui/button'
import { SupplierFormDialog } from '@/features/suppliers/components/supplier-form-dialog'
import { SuppliersTable } from '@/features/suppliers/components/suppliers-table'
import { useSupplierRows } from '@/features/suppliers/hooks/use-supplier-rows'
import { formatCurrency } from '@/lib/format'

export function SuppliersPage(): React.JSX.Element {
  const rows = useSupplierRows()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase()
    return rows.filter(
      (row) =>
        !text || row.supplier.name.toLowerCase().includes(text) || row.supplier.phone.includes(text)
    )
  }, [rows, query])

  const totalOwed = rows.reduce((sum, row) => sum + Math.max(0, row.owed), 0)

  return (
    <>
      <PageHeader
        title="Suppliers"
        actions={
          <>
            <Button variant="outline" onClick={() => setOpen(true)}>
              <Add data-icon="inline-start" />
              Add supplier
            </Button>
            <Button nativeButton={false} render={<Link to="/stock/new" />}>
              <Cart data-icon="inline-start" />
              Buy stock
            </Button>
          </>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <StatCard label="Suppliers" icon={Shop} tone="primary" value={String(rows.length)} />
        <StatCard
          label="You owe"
          icon={Wallet}
          tone="destructive"
          value={formatCurrency(totalOwed)}
        />
      </div>

      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <SearchField
          className="sm:max-w-xs sm:flex-1"
          placeholder="Search suppliers"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <SuppliersTable rows={visible} />

      <SupplierFormDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
