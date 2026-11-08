import { useState } from 'react'
import { Add, Link } from 'reicon-react'
import { toast } from 'sonner'

import { useData } from '@/app/providers/data-context'
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
import { formatCurrency, toNumber } from '@/lib/format'
import type { Product } from '../types'
import { autoSalePrice, DEFAULT_MARKUP, newProductExtras } from '../utils'

// "Add details" from the invoice import: the form opens filled in with what the invoice said, and Save hands the
// values back instead of creating a product (the product is created when the invoice is added to the bill).
export type ProductDraft = {
  values: {
    name: string
    category: string
    brand: string
    costPrice: number
    salePrice: number | null // null = we add 15% to the cost price
    quantity: number
    reorderLevel: number
    shelf: string
  }
  onSave: (values: ProductDraft['values']) => void
  // "This is an existing product": the owner thinks the product is already in the list. Closes this form to pick it.
  onUseExisting?: () => void
}

type ProductFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product // when set, we are editing
  onSaved?: (product: Product) => void // called after a NEW product is added
  // Adding a product from inside a supplier bill: the bill brings the quantity, so the form does not ask for it.
  stockFromBill?: boolean
  draft?: ProductDraft
}

const popularBrands = [
  'Samsung',
  'Apple',
  'Xiaomi',
  'Oppo',
  'Vivo',
  'Infinix',
  'Tecno',
  'Realme',
  'Huawei',
  'Nokia',
  'Generic'
]

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

function ProductForm({
  product,
  onSaved,
  stockFromBill,
  draft,
  onDone
}: {
  product?: Product
  onSaved?: (product: Product) => void
  stockFromBill?: boolean
  draft?: ProductDraft
  onDone: () => void
}): React.JSX.Element {
  const { addProduct, updateProduct, categories } = useData()
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [form, setForm] = useState({
    name: draft?.values.name ?? product?.name ?? '',
    category: draft?.values.category ?? product?.category ?? categories[0]?.name ?? '',
    brand: draft?.values.brand ?? product?.brand ?? '',
    costPrice: String(draft?.values.costPrice ?? product?.costPrice ?? ''),
    // empty = the app adds 15% to the cost price
    salePrice: String(draft ? (draft.values.salePrice ?? '') : (product?.salePrice ?? '')),
    stock: draft ? String(draft.values.quantity) : product ? String(product.stock) : '',
    reorderLevel: String(draft?.values.reorderLevel ?? product?.reorderLevel ?? '5'),
    shelf: draft?.values.shelf ?? product?.shelf ?? ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const text = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }
  const pick = (key: keyof typeof form) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  // In draft mode the "quantity" is the quantity on the invoice, so it is always asked.
  const askStock = draft ? true : !stockFromBill
  // An invoice may use a category you do not have yet. It is created when the items are added to the bill.
  const categoryNames = categories.map((c) => c.name)
  if (form.category && !categoryNames.includes(form.category)) categoryNames.push(form.category)

  const cost = toNumber(form.costPrice)
  const suggested = cost > 0 ? autoSalePrice(cost) : 0
  const price = toNumber(form.salePrice) > 0 ? toNumber(form.salePrice) : suggested
  const profit = price - cost

  const submit = (): void => {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'Enter the product name.'
    if (!form.category) next.category = 'Choose a category, or add a new one with the + button.'
    if (cost <= 0) next.costPrice = 'Enter the cost price.'
    if (askStock && form.stock.trim() === '') next.stock = 'Enter how many you have.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    const shared = {
      name: form.name.trim(),
      category: form.category,
      brand: form.brand.trim(),
      costPrice: cost,
      salePrice: price,
      reorderLevel: toNumber(form.reorderLevel),
      shelf: form.shelf.trim()
    }
    const stock = askStock ? Math.max(0, toNumber(form.stock)) : 0

    if (draft) {
      draft.onSave({
        name: shared.name,
        category: shared.category,
        brand: shared.brand,
        costPrice: cost,
        salePrice: toNumber(form.salePrice) > 0 ? toNumber(form.salePrice) : null,
        quantity: stock,
        reorderLevel: shared.reorderLevel,
        shelf: shared.shelf
      })
      onDone()
      return
    }

    if (product) {
      // Editing only changes what this form shows. Everything else on the product stays as it was.
      updateProduct(product.id, { ...shared, stock })
      toast.success(`${shared.name} updated`)
    } else {
      onSaved?.(
        addProduct({
          ...shared,
          stock,
          ...newProductExtras(form.category)
        })
      )
      toast.success(`${shared.name} added to inventory`)
    }
    onDone()
  }

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
            inputMode="decimal"
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
            inputMode="decimal"
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
              inputMode="decimal"
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
            inputMode="decimal"
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
        <Button onClick={submit}>
          {draft ? 'Save' : product ? 'Save changes' : 'Add product'}
        </Button>
      </DialogFooter>

      <CategoryFormDialog
        open={categoriesOpen}
        onOpenChange={setCategoriesOpen}
        onSaved={(name) => setForm((prev) => ({ ...prev, category: name }))}
      />
    </>
  )
}
