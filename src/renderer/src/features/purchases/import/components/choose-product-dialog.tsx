import { useMemo, useState } from 'react'
import { Add } from 'reicon-react'

import { useProducts } from '@/features/products/hooks/use-products'
import { CategoryChip } from '@/components/shared/category-chip'
import { SearchField } from '@/components/shared/search-field'
import { selectedClasses } from '@/components/shared/selected-classes'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { matchesSearch } from '@/lib/search'

type ChooseProductDialogProps = {
  lineName: string | null // the invoice wording. The dialog is open while this is set
  onOpenChange: (open: boolean) => void
  onPick: (productId: string) => void
  onNew: () => void
}

// "Which product is this?": your products by name, a search box, and "Add as a new product".
export function ChooseProductDialog({
  lineName,
  onOpenChange,
  onPick,
  onNew
}: ChooseProductDialogProps): React.JSX.Element {
  return (
    <Dialog open={lineName !== null} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-11/12 flex-col">
        {lineName ? <Chooser lineName={lineName} onPick={onPick} onNew={onNew} /> : null}
      </DialogContent>
    </Dialog>
  )
}

function Chooser({
  lineName,
  onPick,
  onNew
}: {
  lineName: string
  onPick: (id: string) => void
  onNew: () => void
}): React.JSX.Element {
  const { products } = useProducts()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  // Your products in name order, narrowed by what you type. The list scrolls, so every product can be reached.
  const shown = useMemo(() => {
    const sorted = [...products].sort((a, b) => a.name.localeCompare(b.name))
    return sorted.filter((p) => matchesSearch(query, [p.name, p.brand, p.category]))
  }, [products, query])

  const newRow = shown.length // the last row is always "Add as a new product"
  const current = Math.min(active, newRow)

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const rows = newRow + 1
      setActive((current + (event.key === 'ArrowDown' ? 1 : rows - 1)) % rows)
    } else if (event.key === 'Enter') {
      if (current === newRow) onNew()
      else onPick(shown[current].id)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Which product is this?</DialogTitle>
        <DialogDescription>On the invoice: {lineName}</DialogDescription>
      </DialogHeader>

      <SearchField
        autoFocus
        placeholder="Search your products"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setActive(0)
        }}
        onKeyDown={onKeyDown}
      />

      <div className="flex min-h-0 flex-col gap-1.5 overflow-y-auto" role="listbox">
        {shown.map((product, index) => (
          <Button
            key={product.id}
            variant="outline"
            role="option"
            aria-selected={index === current}
            className={cn(
              'h-auto min-w-0 justify-between gap-3 py-2 text-left whitespace-normal',
              index === current && selectedClasses
            )}
            onMouseEnter={() => setActive(index)}
            onClick={() => onPick(product.id)}
          >
            <span className="break-words">{product.name}</span>
            <CategoryChip name={product.category} />
          </Button>
        ))}
        {shown.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">No product with that name.</p>
        ) : null}
        <Button
          variant="outline"
          role="option"
          aria-selected={current === newRow}
          className={cn('justify-start', current === newRow && selectedClasses)}
          onMouseEnter={() => setActive(newRow)}
          onClick={onNew}
        >
          <Add data-icon="inline-start" />
          Add as a new product
        </Button>
      </div>
    </>
  )
}
