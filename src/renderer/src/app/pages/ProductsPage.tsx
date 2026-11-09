import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Add, Box, Category, CloseCircle, Money, Warning } from 'reicon-react'

import { OptionSelect } from '@/components/shared/option-select'
import { PageHeader } from '@/components/shared/page-header'
import { SearchField } from '@/components/shared/search-field'
import { StatCard } from '@/components/shared/stat-card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AddStockDialog } from '@/features/products/components/add-stock-dialog'
import { ProductDeleteDialog } from '@/features/products/components/product-delete-dialog'
import { ProductFormDialog } from '@/features/products/components/product-form-dialog'
import { ProductsTable } from '@/features/products/components/products-table'
import { useProducts } from '@/features/products/hooks/use-products'
import { useProductFilters, type StockFilter } from '@/features/products/hooks/use-product-filters'
import { getStockLevel, type Product } from '@/features/products/types'
import { formatCurrency } from '@/lib/format'

export function ProductsPage(): React.JSX.Element {
  const { products } = useProducts()
  const [params] = useSearchParams()
  const filters = useProductFilters(products, params.get('category') ?? 'all')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Product | undefined>()
  const [stockTarget, setStockTarget] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)

  const lowCount = products.filter((p) => getStockLevel(p) === 'low').length
  const outCount = products.filter((p) => getStockLevel(p) === 'out').length
  const stockValue = products.reduce((sum, p) => sum + p.stock * p.costPrice, 0)

  const openForm = (product?: Product): void => {
    setEditing(product)
    setFormOpen(true)
  }

  return (
    <>
      <PageHeader
        title="Products"
        actions={
          <>
            <Button variant="outline" nativeButton={false} render={<Link to="/categories" />}>
              <Category data-icon="inline-start" />
              Categories
            </Button>
            <Button onClick={() => openForm()}>
              <Add data-icon="inline-start" />
              Add product
            </Button>
          </>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Products" icon={Box} tone="primary" value={String(products.length)} />
        <StatCard
          label="Value of your stock"
          icon={Money}
          tone="success"
          value={formatCurrency(stockValue)}
        />
        <StatCard label="Low stock" icon={Warning} tone="warning" value={String(lowCount)} />
        <StatCard
          label="Out of stock"
          icon={CloseCircle}
          tone="destructive"
          value={String(outCount)}
        />
      </div>

      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center">
        <SearchField
          className="md:max-w-xs md:flex-1"
          placeholder="Search part, brand or item code"
          value={filters.query}
          onChange={(event) => filters.setQuery(event.target.value)}
        />
        <OptionSelect
          className="w-full md:w-44"
          value={filters.category}
          onValueChange={filters.setCategory}
          options={[
            { value: 'all', label: 'All categories' },
            ...filters.categories.map((c) => ({ value: c, label: c }))
          ]}
        />
        <Tabs
          value={filters.stock}
          onValueChange={(value) => filters.setStock(value as StockFilter)}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="low">Low</TabsTrigger>
            <TabsTrigger value="out">Out</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ProductsTable
        products={filters.filtered}
        onEdit={openForm}
        onAddStock={setStockTarget}
        onDelete={setDeleting}
      />

      <ProductFormDialog open={formOpen} onOpenChange={setFormOpen} product={editing} />
      {deleting ? (
        <ProductDeleteDialog
          product={deleting}
          open
          onOpenChange={(open) => !open && setDeleting(null)}
        />
      ) : null}
      <AddStockDialog
        product={stockTarget}
        onOpenChange={(open) => !open && setStockTarget(null)}
      />
    </>
  )
}
