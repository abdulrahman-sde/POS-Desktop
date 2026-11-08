import { Cart } from 'reicon-react'

import { EmptyState } from '@/components/shared/empty-state'
import { QtyPriceHeader, QtyPriceRow } from '@/components/shared/qty-price-row'
import type { PosCart } from '../hooks/use-pos-cart'

export function PosCartLines({ cart }: { cart: PosCart }): React.JSX.Element {
  if (cart.items.length === 0) {
    return (
      <EmptyState
        icon={Cart}
        title="Nothing added yet"
        description="Tap a product, or scan a barcode, to add it."
      />
    )
  }

  return (
    // min-w keeps the row from being squashed. In a narrow panel the list gets a scrollbar at the bottom.
    <div className="min-w-80">
      <QtyPriceHeader priceLabel="Sale price" onClear={cart.reset} />
      <ul className="flex flex-col gap-2 p-2">
        {cart.items.map((item) => (
          <li
            key={item.productId}
            className="flex flex-col gap-1.5 rounded-lg border border-border bg-background p-2"
          >
            <p className="text-sm break-words">{item.name}</p>
            <QtyPriceRow
              name={item.name}
              qty={item.qty}
              price={item.unitPrice}
              onQtyChange={(qty) => cart.setQty(item.productId, qty)}
              onPriceChange={(price) => cart.setUnitPrice(item.productId, price)}
              onRemove={() => cart.removeLine(item.productId)}
            />
            {item.unitPrice < item.costPrice ? (
              <p className="text-xs text-destructive">Less than what you paid for it.</p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
