import { useEffect, useRef } from 'react'
import { Coin } from 'reicon-react'

import { Badge } from '@/components/ui/badge'
import { CategoryChip } from '@/components/shared/category-chip'
import { Button } from '@/components/ui/button'
import { getStockLevel, type Product } from '@/features/products/types'
import { selectedClasses } from '@/components/shared/selected-classes'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

type PosProductTileProps = {
  product: Product
  inCart: number
  selected?: boolean // the keyboard has this tile selected: Enter adds it
  onAdd: () => void
}

// One product on the New Sale screen, top to bottom:
// name, then the cost price (strong) and the usual price (small and grey), then the category chip on the left and the stock on the right. min-w-0 and wrapping keep it inside its column.
export function PosProductTile({
  product,
  inCart,
  selected,
  onAdd
}: PosProductTileProps): React.JSX.Element {
  const out = getStockLevel(product) === 'out'
  const ref = useRef<HTMLButtonElement>(null)

  // When the arrow keys move the selection here, scroll so the tile is in view.
  useEffect(() => {
    if (selected) ref.current?.scrollIntoView({ block: 'nearest' })
  }, [selected])

  return (
    <Button
      ref={ref}
      variant="outline"
      disabled={out}
      onClick={onAdd}
      aria-selected={selected}
      className={cn(
        'h-auto min-w-0 flex-col items-stretch gap-2.5 p-3 text-left whitespace-normal',
        selected && selectedClasses
      )}
    >
      <span className="flex items-start justify-between gap-2">
        <span className="break-words">{product.name}</span>
        {inCart > 0 ? <Badge>{inCart}</Badge> : null}
      </span>

      {/* Cost price comes first and is the strongest line. The usual price is smaller and quieter on purpose. */}
      <span className="flex flex-col gap-1">
        <span className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-sm whitespace-nowrap">
            <Coin className="size-4" />
            Cost price
          </span>
          <span className="text-base whitespace-nowrap">{formatCurrency(product.costPrice)}</span>
        </span>
        <span className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="whitespace-nowrap">Usual price</span>
          <span className="whitespace-nowrap">{formatCurrency(product.salePrice)}</span>
        </span>
      </span>

      <span className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <CategoryChip name={product.category} />
        <span className="text-xs text-muted-foreground">
          {out ? 'Out of stock' : `${product.stock} ${product.unit} left`}
        </span>
      </span>
    </Button>
  )
}
