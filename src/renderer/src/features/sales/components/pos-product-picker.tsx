import { useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import { useData } from '@/app/providers/data-context'
import { EmptyState } from '@/components/shared/empty-state'
import { SearchField } from '@/components/shared/search-field'
import { Button } from '@/components/ui/button'
import type { Product } from '@/features/products/types'
import { PosProductTile } from './pos-product-tile'
import { Box } from 'reicon-react'

type PosProductPickerProps = {
  searchRef: React.RefObject<HTMLInputElement | null>
  qtyInCart: (productId: string) => number
  onAdd: (product: Product) => boolean
}

export function PosProductPicker({
  searchRef,
  qtyInCart,
  onAdd
}: PosProductPickerProps): React.JSX.Element {
  const { products, categories: allCategories } = useData()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  // Which tile the keyboard has selected. It is shown once you type or press an arrow key.
  const [active, setActive] = useState(0)
  const [navigated, setNavigated] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  // Only show categories that have at least one product.
  const categories = allCategories
    .map((category) => category.name)
    .filter((name) => products.some((product) => product.category === name))

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase()
    return products.filter((product) => {
      if (category !== 'all' && product.category !== category) return false
      if (!text) return true
      return [
        product.name,
        product.sku,
        product.barcode,
        product.brand,
        product.compatibleModels
      ].some((value) => value.toLowerCase().includes(text))
    })
  }, [products, query, category])

  const add = (product: Product): void => {
    if (!onAdd(product)) toast.error(`No more ${product.name} in stock`)
  }

  const current = Math.min(active, Math.max(0, visible.length - 1))
  const showSelection = (query.trim() !== '' || navigated) && visible.length > 0

  // Keyboard: arrows move the selected tile, Enter adds it. Up and Down jump a whole row, Left and Right one tile
  // (they only take over from the text cursor when it is at the end of the text). A scanner types a barcode and presses
  // Enter, so an exact barcode or item code match is always added first.
  const onSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    const input = event.currentTarget
    const atEnd =
      input.selectionStart === input.value.length && input.selectionEnd === input.value.length
    const columns = Math.max(
      1,
      getComputedStyle(gridRef.current ?? document.body).gridTemplateColumns.split(' ').length
    )
    const move = (step: number): void => {
      event.preventDefault()
      setNavigated(true)
      setActive(Math.min(Math.max(0, current + step), visible.length - 1))
    }

    if (event.key === 'ArrowDown') return move(columns)
    if (event.key === 'ArrowUp') return move(-columns)
    if (event.key === 'ArrowRight' && atEnd) return move(1)
    if (event.key === 'ArrowLeft' && atEnd && current > 0) return move(-1)
    if (event.key === 'Escape') {
      setQuery('')
      setNavigated(false)
      return
    }
    if (event.key !== 'Enter') return

    const text = query.trim().toLowerCase()
    if (!text && !navigated) return
    const exact = text
      ? products.find((p) => p.barcode.toLowerCase() === text || p.sku.toLowerCase() === text)
      : undefined
    const match = exact ?? visible[current]
    if (!match) {
      toast.error('No product found')
      return
    }
    add(match)
    setQuery('')
    setActive(0)
    setNavigated(false)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <SearchField
        ref={searchRef}
        autoFocus
        placeholder="Search or scan a barcode"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setActive(0)
        }}
        onKeyDown={onSearchKeyDown}
      />

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {['all', ...categories].map((name) => (
          <Button
            key={name}
            size="sm"
            className="shrink-0"
            variant={category === name ? 'default' : 'outline'}
            onClick={() => {
              setCategory(name)
              setActive(0)
            }}
          >
            {name === 'all' ? 'All' : name}
          </Button>
        ))}
      </div>

      <div className="min-h-0 flex-1 md:overflow-y-auto">
        {visible.length === 0 ? (
          <EmptyState
            icon={Box}
            title="No products match"
            description="Try another name, SKU or barcode."
          />
        ) : (
          <div ref={gridRef} className="product-grid gap-2">
            {visible.map((product, index) => (
              <PosProductTile
                key={product.id}
                product={product}
                inCart={qtyInCart(product.id)}
                selected={showSelection && index === current}
                onAdd={() => add(product)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
