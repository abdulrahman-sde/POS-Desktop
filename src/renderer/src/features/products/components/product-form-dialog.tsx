import { useState } from 'react'
import { Add, Link } from 'reicon-react'

import { CategoryFormDialog } from '@/features/categories/components/category-form-dialog'
import { FormField } from '@/components/shared/form-field'
import { OptionSelect } from '@/components/shared/option-select'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/format'
import { popularBrands } from '../constants'
import { useProductForm } from '../hooks/use-product-form'
import type { ProductFormDialogProps, ProductFormProps } from '../types'
import { DEFAULT_MARKUP } from '../utils'

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSaved,
  stockFromBill,
  draft
}: ProductFormDialogProps): React.JSX.Element {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-11/12 flex-col sm:max-w-2xl">
        {open ? (
          <ProductForm
            product={product}
            onSaved={onSaved}
            stockFromBill={stockFromBill}
            draft={draft}
            onDone={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function SectionTitle({ children }: { children: string }): React.JSX.Element {
  return (
    <h3 className="border-b border-foreground/10 pb-1 text-sm text-muted-foreground sm:col-span-3">
      {children}
    </h3>
  )
}

function ProductForm(props: ProductFormProps): React.JSX.Element {
  const { product, draft, onDone } = props
  const {
    form,
    errors,
    askStock,
    saving,
    categoryNames,
    cost,
    suggested,
    price,
    profit,
    text,
    pick,
    submit
  } = useProductForm(props)
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {draft ? 'Add details' : product ? 'Edit product' : 'Add product'}
        </DialogTitle>
        <DialogDescription>
          {draft
            ? 'Add anything else you know about this product. It is saved when you add the invoice to your bill.'
            : 'Fields marked * must be filled in. The rest are optional.'}
        </DialogDescription>
      </DialogHeader>

      <div className="grid min-h-0 flex-1 content-start gap-3 overflow-y-auto sm:grid-cols-3">
        <SectionTitle>Basic details</SectionTitle>
        <div className="sm:col-span-3">
          <FormField label="Product name" htmlFor="p-name" error={errors.name} required>
            <Input
              id="p-name"
              autoFocus
              value={form.name}
              onChange={text('name')}
              placeholder="e.g. Samsung A12 LCD Display with Touch"
            />
          </FormField>
        </div>
        <div className="sm:col-span-2">
          <FormField label="Category" htmlFor="p-category" error={errors.category} required>
            <div className="flex gap-2">
              <OptionSelect
                id="p-category"
                value={form.category}
                onValueChange={pick('category')}
                placeholder="Choose a category"
                options={categoryNames.map((name) => ({ value: name, label: name }))}
              />
              <Button
                variant="outline"
                size="icon"
                aria-label="Add a new category"
                onClick={() => setCategoriesOpen(true)}
              >
                <Add />
              </Button>
            </div>
          </FormField>
        </div>
        <FormField label="Brand" htmlFor="p-brand">
          <Input
            id="p-brand"
            list="brand-list"
            value={form.brand}
            onChange={text('brand')}
            placeholder="e.g. Samsung"
          />
          <datalist id="brand-list">
            {popularBrands.map((brand) => (
              <option key={brand} value={brand} />
            ))}
          </datalist>
        </FormField>

        <SectionTitle>Prices</SectionTitle>
        <FormField
          label="Cost price (Rs)"
          htmlFor="p-cost"
          error={errors.costPrice}
          hint="What you paid for one piece"
          required
        >
          <Input
            id="p-cost"
            type="number"
            inputMode="numeric"
            min={0}
            value={form.costPrice}
            onChange={text('costPrice')}
          />
        </FormField>
        <FormField
          label="Selling price (Rs)"
          htmlFor="p-sale"
          hint={`Leave empty and we add ${Math.round(DEFAULT_MARKUP * 100)}% to the cost price. You can change it on each sale.`}
        >
          <Input
            id="p-sale"
            type="number"
            inputMode="numeric"
            min={0}
            value={form.salePrice}
            placeholder={suggested > 0 ? String(suggested) : ''}
            onChange={text('salePrice')}
          />
        </FormField>
        <div className="flex flex-col justify-start gap-1.5 text-sm">
          <span className="text-sm">Profit on one piece</span>
          {price > 0 && cost > 0 ? (
            <span className={profit >= 0 ? 'text-success' : 'text-destructive'}>
              {formatCurrency(profit)} ({Math.round((profit / price) * 100)}%)
            </span>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>

        <SectionTitle>Stock</SectionTitle>
        {askStock ? (
          <FormField
            label={draft ? 'Quantity' : 'Quantity in shop'}
            htmlFor="p-stock"
            error={errors.stock}
            required
          >
            <Input
              id="p-stock"
              type="number"
              inputMode="numeric"
              min={0}
              value={form.stock}
              onChange={text('stock')}
            />
          </FormField>
        ) : null}
        <FormField
          label="Warn me when stock is"
          htmlFor="p-reorder"
          hint="Shows as low stock at this number"
        >
          <Input
            id="p-reorder"
            type="number"
            inputMode="numeric"
            min={0}
            value={form.reorderLevel}
            onChange={text('reorderLevel')}
          />
        </FormField>
        <FormField label="Shelf / location" htmlFor="p-shelf" hint="e.g. A1, Drawer 3">
          <Input id="p-shelf" value={form.shelf} onChange={text('shelf')} />
        </FormField>
      </div>

      <DialogFooter>
        {draft?.onUseExisting ? (
          <Button
            variant="outline"
            className="sm:mr-auto"
            onClick={() => {
              draft.onUseExisting?.()
              onDone()
            }}
          >
            <Link data-icon="inline-start" />
            This is an existing product
          </Button>
        ) : null}
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={saving}>
          {draft ? 'Save' : product ? 'Save changes' : 'Add product'}
        </Button>
      </DialogFooter>

      <CategoryFormDialog
        open={categoriesOpen}
        onOpenChange={setCategoriesOpen}
        onSaved={pick('category')}
      />
    </>
  )
}
