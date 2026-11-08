import { Box } from 'reicon-react'

import { EmptyState } from '@/components/shared/empty-state'
import { QtyPriceHeader, QtyPriceRow } from '@/components/shared/qty-price-row'
import type { PurchaseCart } from '../hooks/use-purchase-cart'

export function PurchaseLines({ cart }: { cart: PurchaseCart }): React.JSX.Element {
  if (cart.items.length === 0) {
    return (
      <EmptyState
        icon={Box}
        title="Nothing added yet"
        description="Search for a product above. If it is new, you can add it right there."
      />
    )
  }

  return (
    <div className="min-w-80">
      <QtyPriceHeader priceLabel="Cost price" />
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
              price={item.costPrice}
              onQtyChange={(qty) => cart.setQty(item.productId, qty)}
              onPriceChange={(price) => cart.setCost(item.productId, price)}
              onRemove={() => cart.removeLine(item.productId)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
