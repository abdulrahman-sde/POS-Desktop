import { Link } from 'react-router'

import { StockBadge } from '@/components/shared/stock-badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Product } from '@/features/products/types'

export function LowStockCard({ products }: { products: Product[] }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Running low</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link to="/products" />}>
            Inventory
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col divide-y">
        {products.length === 0 ? (
          <p className="py-2 text-muted-foreground">All items are well stocked.</p>
        ) : (
          products.slice(0, 5).map((product) => (
            <div key={product.id} className="flex items-center justify-between gap-3 py-2">
              <span className="flex min-w-0 flex-col">
                <span className="break-words">{product.name}</span>
                <span className="text-xs text-muted-foreground">
                  {product.stock} {product.unit} left
                </span>
              </span>
              <StockBadge product={product} />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
