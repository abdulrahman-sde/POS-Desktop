import { useMemo, useState } from 'react'
import { Add } from 'reicon-react'

import { SearchField } from '@/components/shared/search-field'
import { Button } from '@/components/ui/button'
import { ProductFormDialog } from '@/features/products/components/product-form-dialog'
import { useProducts } from '@/features/products/hooks/use-products'
import { PRODUCT_UNIT, type Product } from '@/features/products/types'
import { cn } from '@/lib/utils'
import { selectedClasses } from '@/components/shared/selected-classes'
import type { PurchaseProductSearchProps } from '../types'

export function PurchaseProductSearch({ onAdd }: PurchaseProductSearchProps): React.JSX.Element {
  const { products } = useProducts()
  const [query, setQuery] = useState('')
  const [newOpen, setNewOpen] = useState(false)
  const [active, setActive] = useState(0)

  const matches = useMemo(() => {
    const text = query.trim().toLowerCase()
    if (!text) return []
    return products
      .filter((product) =>
        [product.name, product.itemCode, product.brand].some((value) =>
          value.toLowerCase().includes(text)
        )
      )
      .slice(0, 6)
  }, [products, query])

  const pick = (product: Product): void => {
    onAdd(product)
    setQuery('')
  }

  const newRow = matches.length
  const current = Math.min(active, newRow)

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (!query.trim()) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const rows = newRow + 1
      setActive((current + (event.key === 'ArrowDown' ? 1 : rows - 1)) % rows)
    } else if (event.key === 'Escape') {
      setQuery('')
    } else if (event.key === 'Enter') {
      const text = query.trim().toLowerCase()
      const exact = products.find((p) => p.itemCode.toLowerCase() === text)
      const match = exact ?? matches[current]
      if (match) pick(match)
      else setNewOpen(true)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <SearchField
        autoFocus
        placeholder="Search or scan a product"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setActive(0)
        }}
        onKeyDown={onKeyDown}
      />

      {query.trim() ? (
        <div className="flex flex-col gap-1.5" role="listbox">
          {matches.map((product, index) => (
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
              onClick={() => pick(product)}
            >
              <span className="flex flex-col">
                <span className="break-words">{product.name}</span>
                <span className="text-xs text-muted-foreground">{product.brand}</span>
              </span>
              <span className="text-xs whitespace-nowrap text-muted-foreground">
                {product.stock} {PRODUCT_UNIT} in shop
              </span>
            </Button>
          ))}
          <Button
            variant="outline"
            role="option"
            aria-selected={current === newRow}
            className={cn('justify-start', current === newRow && selectedClasses)}
            onMouseEnter={() => setActive(newRow)}
            onClick={() => setNewOpen(true)}
          >
            <Add data-icon="inline-start" />
            {matches.length === 0 ? 'Not found. Add as a new product' : 'Add a new product'}
          </Button>
        </div>
      ) : null}

      <ProductFormDialog
        stockFromBill
        open={newOpen}
        onOpenChange={setNewOpen}
        onSaved={(product) => {
          onAdd(product)
          setQuery('')
        }}
      />
    </div>
  )
}
