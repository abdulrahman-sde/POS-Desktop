import { useState } from 'react'
import { Category as CategoryIcon, Edit, Trash } from 'reicon-react'
import { Link } from 'react-router'
import { toast } from 'sonner'

import { EmptyState } from '@/components/shared/empty-state'
import { SHOW_DELETE } from '@/lib/features'
import { Badge } from '@/components/ui/badge'
import { DialogItemName } from '@/components/shared/dialog-item-name'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { formatCurrency, plural } from '@/lib/format'
import { useDeleteCategory } from '../hooks/use-category-mutations'
import type { Category, CategoryRow } from '../types'
import { CategoryFormDialog } from './category-form-dialog'

export function CategoriesTable({ rows }: { rows: CategoryRow[] }): React.JSX.Element {
  const deleteCategory = useDeleteCategory()
  const [editing, setEditing] = useState<Category | undefined>()
  const [deleting, setDeleting] = useState<Category | null>(null)

  return (
    <Card className="gap-0 px-3 py-1">
      {rows.length === 0 ? (
        <EmptyState
          icon={CategoryIcon}
          title="No categories found"
          description="Add a category to group your products."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="hidden sm:table-cell text-right">Value of stock</TableHead>
              <TableHead className="w-0" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ category, productCount, stockValue }) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  <Badge variant={productCount > 0 ? 'info' : 'secondary'}>
                    {plural(productCount, 'product')}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-right text-muted-foreground">
                  {formatCurrency(stockValue)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    {productCount > 0 ? (
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={
                          <Link to={`/products?category=${encodeURIComponent(category.name)}`} />
                        }
                      >
                        View products
                      </Button>
                    ) : null}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Rename ${category.name}`}
                      onClick={() => setEditing(category)}
                    >
                      <Edit />
                    </Button>
                    {SHOW_DELETE.categories ? (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${category.name}`}
                        disabled={productCount > 0}
                        title={
                          productCount > 0
                            ? 'Move its products to another category first'
                            : 'Delete this category'
                        }
                        onClick={() => setDeleting(category)}
                      >
                        <Trash />
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <CategoryFormDialog
        open={editing !== undefined}
        onOpenChange={(open) => !open && setEditing(undefined)}
        category={editing}
      />

      <Dialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this category?</DialogTitle>
          </DialogHeader>
          <DialogItemName name={deleting?.name ?? ''} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteCategory.isPending}
              onClick={() => {
                if (deleting) {
                  // A refused delete (the backend counts the products) shows its message as a toast.
                  deleteCategory.mutate(deleting, {
                    onError: (error) => toast.error(error.message)
                  })
                }
                setDeleting(null)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
