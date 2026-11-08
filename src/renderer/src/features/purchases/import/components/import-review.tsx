import { useRef, useState } from 'react'
import { Add, Edit, Trash } from 'reicon-react'
import { toast } from 'sonner'

import { CategoryChip } from '@/components/shared/category-chip'
import { selectedClasses } from '@/components/shared/selected-classes'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ProductFormDialog } from '@/features/products/components/product-form-dialog'
import { useProducts } from '@/features/products/hooks/use-products'
import { PRODUCT_UNIT } from '@/features/products/types'
import { formatCurrency, plural } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { ImportSessionApi } from '../hooks/use-import-session'
import type { ImportRow } from '../types'
import { ChooseProductDialog } from './choose-product-dialog'
import { EditableNumber } from './editable-number'
import { MatchedProductDialog } from './matched-product-dialog'

// One line of the list is a grid (`import-row` in index.css) whose columns share the width in proportion, so extra room is
// spread out evenly and the gaps stay equal. The heading line and every item use the same grid, so they always line up.
// When the panel is too narrow for one line (`@row`), an item becomes a two-line card and these classes make its cells
// roomier. The widths below are only for that two-line card.
const noColumn = 'w-7 shrink-0 text-center'
const qtyColumn = 'w-20 shrink-0 @row:w-full'
const costColumn = 'w-28 shrink-0 @row:w-full'
const totalColumn = 'w-24 shrink-0 @row:w-full'
const matchColumn = 'w-auto shrink-0 @row:w-full'
const binColumn = 'w-5 shrink-0 @row:w-full'

// Only the first words of a product name are shown in the list, to keep it narrow. The full name is in the hover and in the details.
// At most 3 words and about 18 letters, so it always fits on ONE line of the button.
const firstWords = (name: string, maxWords = 3, maxLetters = 18): string => {
  const words = name.trim().split(/\s+/)
  let shown = words[0] ?? ''
  for (const word of words.slice(1, maxWords)) {
    if (`${shown} ${word}`.length > maxLetters) break
    shown = `${shown} ${word}`
  }
  return shown
}

type Section = { heading: string; rows: ImportRow[] }

// One cell of an item. A caption sits above it only in the two-line card (the fixed headings are hidden there). Every
// cell has a control box of the same height and its content is centred, so everything lines up.
function Cell({
  caption,
  className,
  children
}: {
  caption: string
  className: string
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <div className={cn('order-2 flex flex-col gap-0.5 @row:order-none', className)}>
      <span className="text-center text-xs text-muted-foreground @row:hidden">{caption}</span>
      <div className="flex h-8 items-center justify-center">{children}</div>
    </div>
  )
}

// The right-hand side of the import page. The list is the invoice as it is: the same order, the same item numbers, a
// category heading wherever the invoice has one. Nothing is ever moved or renumbered, whatever you change in a row.
export function ImportReview({
  importer,
  onAddToBill,
  onDiscard
}: {
  importer: ImportSessionApi
  onAddToBill: () => void
  onDiscard: () => void
}): React.JSX.Element {
  const { products } = useProducts()
  const { session, addRow, patchRow, pickProduct, pickNew } = importer
  const [viewing, setViewing] = useState<ImportRow | null>(null) // opened the matched product
  const [choosing, setChoosing] = useState<ImportRow | null>(null) // picking a different product
  const [detailing, setDetailing] = useState<ImportRow | null>(null) // the Add product form for a new product
  // The row being worked on keeps a coloured border, so you can find it again when a window closes.
  const [activeId, setActiveId] = useState<string | null>(null)
  const scrollTo = useRef<string | null>(null) // a row just added by hand: scroll to it
  const focusName = useRef<string | null>(null) // ...and put the cursor in its name

  if (!session || session.status === 'reading' || !session.invoice) {
    return (
      <div className="flex flex-col gap-2 p-4">
        <p className="text-sm text-muted-foreground">Reading your invoice...</p>
        {[0, 1, 2, 3, 4].map((n) => (
          <Skeleton key={n} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  const active = session.rows.filter((row) => row.included)
  const newCount = active.filter((row) => row.productId === null).length
  const itemsTotal = active.reduce((sum, row) => sum + row.qty * row.costPrice, 0)
  const skipped = session.invoice.skipped ?? [] // an import opened before skipping existed has none
  const skippedTotal = skipped.reduce((sum, line) => sum + line.amount, 0)
  const invalid = active.some(
    (row) => row.qty <= 0 || row.costPrice <= 0 || (row.productId === null && !row.name.trim())
  )
  const problem =
    active.length === 0
      ? 'There is nothing to add.'
      : invalid
        ? 'Every item needs a name, a quantity and a price.'
        : ''

  // The invoice order, with a heading each time the invoice's category changes. Never regrouped or sorted.
  const sections: Section[] = []
  for (const row of active) {
    const heading = row.heading ?? row.category // an import opened before headings were kept
    const last = sections[sections.length - 1]
    if (last && last.heading === heading) last.rows.push(row)
    else sections.push({ heading, rows: [row] })
  }

  const addNewProduct = (): void => {
    const id = addRow()
    setActiveId(id)
    scrollTo.current = id
    focusName.current = id
  }

  const remove = (row: ImportRow): void => {
    patchRow(row.id, { included: false })
    toast(`${row.invoiceName || row.name || 'Item'} removed`, {
      action: { label: 'Undo', onClick: () => patchRow(row.id, { included: true }) }
    })
  }

  const viewingProduct = viewing ? (products.find((p) => p.id === viewing.productId) ?? null) : null

  return (
    <>
      {/* One scrolling list. The column headings stick to the top, so they stay in place while you scroll. */}
      <div className="@container min-h-0 flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 hidden items-center border-b border-border bg-card px-4 py-2 text-center text-xs text-muted-foreground @row:import-row">
          <span>Item</span>
          <span>Name</span>
          <span>Quantity</span>
          <span>Cost price</span>
          <span>Total</span>
          <span />
          <span />
        </div>

        <div className="flex flex-col gap-1.5 p-2">
          {sections.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">Nothing here.</p>
          ) : (
            sections.map((section, sectionIndex) => (
              <section key={`${section.heading}-${sectionIndex}`} className="flex flex-col gap-1.5">
                <div className="mt-1 flex items-center gap-2">
                  <CategoryChip name={section.heading} />
                  <span className="text-xs text-muted-foreground">
                    {plural(section.rows.length, 'item')}
                  </span>
                </div>
                {section.rows.map((row) => {
                  const isNew = row.productId === null
                  const product = products.find((p) => p.id === row.productId)
                  // An import opened before item numbers existed has none: use the position instead.
                  const number = row.no ?? session.rows.indexOf(row) + 1
                  return (
                    <div
                      key={row.id}
                      ref={(element) => {
                        if (element && scrollTo.current === row.id) {
                          scrollTo.current = null
                          element.scrollIntoView({ block: 'nearest' })
                        }
                      }}
                      onFocusCapture={() => setActiveId(row.id)}
                      onPointerDownCapture={() => setActiveId(row.id)}
                      className={cn(
                        'flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 rounded-lg border px-2 py-1.5 @row:justify-start @row:import-row',
                        activeId === row.id ? selectedClasses : 'border-border bg-background'
                      )}
                    >
                      <span className={cn(noColumn, 'text-sm text-muted-foreground')}>
                        {number}
                      </span>

                      <div className="min-w-0 flex-1 @row:flex-none">
                        {isNew ? (
                          <Input
                            value={row.name}
                            placeholder="Product name"
                            aria-label={`Name of item ${number}`}
                            className="h-8 text-sm"
                            ref={(element) => {
                              if (element && focusName.current === row.id) {
                                focusName.current = null
                                element.focus()
                              }
                            }}
                            onChange={(event) => patchRow(row.id, { name: event.target.value })}
                          />
                        ) : (
                          <p className="py-0.5 text-sm break-words">{row.invoiceName}</p>
                        )}
                      </div>

                      <Cell caption="Quantity" className={qtyColumn}>
                        <EditableNumber
                          className="w-full"
                          label={`Quantity of item ${number}`}
                          value={row.qty}
                          onChange={(qty) => patchRow(row.id, { qty })}
                        />
                      </Cell>
                      <Cell caption="Cost price" className={costColumn}>
                        <EditableNumber
                          className="w-full"
                          label={`Cost price of item ${number}`}
                          value={row.costPrice}
                          onChange={(costPrice) => patchRow(row.id, { costPrice })}
                        />
                      </Cell>
                      <Cell caption="Total" className={totalColumn}>
                        <span className="text-sm whitespace-nowrap">
                          {formatCurrency(row.qty * row.costPrice)}
                        </span>
                      </Cell>

                      <Cell caption="Matched product" className={matchColumn}>
                        <div className="flex items-center gap-1.5">
                          {isNew ? (
                            <>
                              {/* Not in your products: it will be added as a new one. A soft blue tag, not a button. */}
                              <Badge variant="info" className="bg-info/15">
                                New
                              </Badge>
                              <Button
                                variant="outline"
                                size="icon-xs"
                                aria-label={`Edit the details of item ${number}`}
                                title="Edit details"
                                onClick={() => setDetailing(row)}
                              >
                                <Edit />
                              </Button>
                            </>
                          ) : (
                            // The first words of the product's name. Hover for the full name and the stock, click for the details.
                            <Tooltip>
                              <TooltipTrigger
                                render={
                                  <Button
                                    variant="outline"
                                    size="xs"
                                    className="max-w-full justify-start border-success/30 bg-success/10 text-success hover:bg-success/20 hover:text-success"
                                    onClick={() => setViewing(row)}
                                  />
                                }
                              >
                                {product ? firstWords(product.name) : 'Choose a product'}
                              </TooltipTrigger>
                              {product ? (
                                <TooltipContent>
                                  <div className="flex flex-col">
                                    <span>{product.name}</span>
                                    <span className="opacity-70">
                                      {product.stock} {PRODUCT_UNIT} in stock
                                    </span>
                                  </div>
                                </TooltipContent>
                              ) : null}
                            </Tooltip>
                          )}
                        </div>
                      </Cell>

                      {/* In the one-line layout the bin is last. In the two-line layout it moves up beside the name. */}
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className={cn(
                          binColumn,
                          'order-1 size-5 @row:order-none @row:justify-self-center'
                        )}
                        aria-label={`Remove item ${number}`}
                        title="Remove"
                        onClick={() => remove(row)}
                      >
                        <Trash className="size-3.5" />
                      </Button>
                      {/* Pushes quantity, cost price, total and matched product onto their own line when the panel is narrow. */}
                      <span aria-hidden className="order-1 h-0 basis-full @row:hidden" />
                    </div>
                  )
                })}
              </section>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-border p-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="text-muted-foreground">
            Invoice total {formatCurrency(session.invoice.total)}
          </span>
          {skipped.length > 0 ? (
            <span className="text-muted-foreground">
              Not added: {skipped.map((line) => line.name).join(', ')} (
              {formatCurrency(skippedTotal)})
            </span>
          ) : null}
          {itemsTotal + skippedTotal !== session.invoice.total ? (
            <span className="text-warning">
              The items add up to {formatCurrency(itemsTotal + skippedTotal)}
            </span>
          ) : null}
          {newCount > 0 ? <span className="text-muted-foreground">{newCount} new</span> : null}
          {problem ? <span className="text-muted-foreground">{problem}</span> : null}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {/* For a product the PDF reading missed: a new line to type in by hand. */}
          <Button variant="outline" className="mr-auto" onClick={addNewProduct}>
            <Add data-icon="inline-start" />
            Add new product
          </Button>
          <Button variant="outline" onClick={onDiscard}>
            Discard
          </Button>
          {/* One click puts every item into place: existing products get the stock, new ones are created. */}
          <Button disabled={problem !== ''} onClick={onAddToBill}>
            Add all to bill
          </Button>
        </div>
      </div>

      <MatchedProductDialog
        product={viewingProduct}
        invoiceName={viewing?.invoiceName ?? ''}
        onOpenChange={(open) => !open && setViewing(null)}
        onChange={() => {
          setChoosing(viewing)
          setViewing(null)
        }}
      />

      {/* Switching a line between "existing product" and "new product" never moves it: it stays at its invoice position. */}
      <ChooseProductDialog
        lineName={choosing ? choosing.invoiceName || choosing.name || 'New item' : null}
        onOpenChange={(open) => !open && setChoosing(null)}
        onPick={(productId) => {
          if (choosing) pickProduct(choosing.id, productId)
          setChoosing(null)
        }}
        onNew={() => {
          if (choosing) pickNew(choosing.id)
          setChoosing(null)
        }}
      />

      {/* The same Add product form, filled in with what we already know. It does not create the product yet. */}
      <ProductFormDialog
        open={detailing !== null}
        onOpenChange={(open) => !open && setDetailing(null)}
        draft={
          detailing
            ? {
                values: {
                  name: detailing.name,
                  category: detailing.category,
                  brand: detailing.details.brand,
                  costPrice: detailing.costPrice,
                  salePrice: detailing.details.salePrice,
                  quantity: detailing.qty,
                  reorderLevel: detailing.details.reorderLevel,
                  shelf: detailing.details.shelf
                },
                onUseExisting: () => setChoosing(detailing),
                onSave: (values) =>
                  patchRow(detailing.id, {
                    name: values.name,
                    category: values.category,
                    qty: values.quantity,
                    costPrice: values.costPrice,
                    details: {
                      brand: values.brand,
                      salePrice: values.salePrice,
                      reorderLevel: values.reorderLevel,
                      shelf: values.shelf
                    }
                  })
              }
            : undefined
        }
      />
    </>
  )
}
