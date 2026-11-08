import { useMemo, useState } from 'react'
import { Add, Box, Category, Warning } from 'reicon-react'

import { PageHeader } from '@/components/shared/page-header'
import { SearchField } from '@/components/shared/search-field'
import { StatCard } from '@/components/shared/stat-card'
import { Button } from '@/components/ui/button'
import { CategoriesTable } from '@/features/categories/components/categories-table'
import { CategoryFormDialog } from '@/features/categories/components/category-form-dialog'
import { useCategoryRows } from '@/features/categories/hooks/use-category-rows'

export function CategoriesPage(): React.JSX.Element {
  const rows = useCategoryRows()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase()
    return rows.filter((row) => !text || row.category.name.toLowerCase().includes(text))
  }, [rows, query])

  const totalProducts = rows.reduce((sum, row) => sum + row.productCount, 0)
  const emptyCount = rows.filter((row) => row.productCount === 0).length

  return (
    <>
      <PageHeader
        title="Categories"
        description="Group your products, so they are easy to find when selling."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Add data-icon="inline-start" />
            Add category
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Categories" icon={Category} tone="primary" value={String(rows.length)} />
        <StatCard label="Products in them" icon={Box} tone="info" value={String(totalProducts)} />
        <StatCard
          label="Categories with no products"
          icon={Warning}
          tone="warning"
          value={String(emptyCount)}
        />
      </div>

      <SearchField
        className="mb-3 sm:max-w-xs"
        placeholder="Search categories"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <CategoriesTable rows={visible} />

      <CategoryFormDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
