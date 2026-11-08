import { Add, Box, Edit } from 'reicon-react'

import { EmptyState } from '@/components/shared/empty-state'
import { StockBadge } from '@/components/shared/stock-badge'
import { CategoryChip } from '@/components/shared/category-chip'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/format'
import type { Product } from '../types'

type ProductsTableProps = {
  products: Product[]
  onEdit: (product: Product) => void
  onAddStock: (product: Product) => void
}

export function ProductsTable({
  products,
  onEdit,
  onAddStock
}: ProductsTableProps): React.JSX.Element {
  return (
    <Card className="gap-0 px-3 py-1">
      {products.length === 0 ? (
        <EmptyState
          icon={Box}
          title="No products found"
          description="Try a different search or filter."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="hidden lg:table-cell text-right">Cost price</TableHead>
              <TableHead className="text-right">Selling price</TableHead>
              <TableHead className="w-0" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span>{product.name}</span>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <CategoryChip name={product.category} />
                      {product.shelf ? (
                        <span className="text-xs text-muted-foreground">Shelf {product.shelf}</span>
                      ) : null}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-start gap-1">
                    <span>
                      {product.stock} {product.unit}
                    </span>
                    <StockBadge product={product} />
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-right text-muted-foreground">
                  {formatCurrency(product.costPrice)}
                </TableCell>
                <TableCell className="text-right">{formatCurrency(product.salePrice)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="outline" size="sm" onClick={() => onAddStock(product)}>
                      <Add data-icon="inline-start" />
                      Add stock
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${product.name}`}
                      onClick={() => onEdit(product)}
                    >
                      <Edit />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  )
}
