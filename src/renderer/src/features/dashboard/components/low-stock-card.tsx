import { Link } from 'react-router'

import { StockBadge } from '@/components/shared/stock-badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PRODUCT_UNIT, type Product } from '@/features/products/types'

export function LowStockCard({ products }: { products: Product[] }): React.JSX.Element {
  return (
    <Card>
      <CardHeader className="border-b border-foreground/10">
        <CardTitle>Running low</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link to="/products" />}>
            Inventory
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col divide-y divide-foreground/10 px-2">
        {products.length === 0 ? (
          <p className="px-2 py-2 text-muted-foreground">All items are well stocked.</p>
        ) : (
          products.slice(0, 5).map((product) => (
            <div key={product.id} className="flex items-center justify-between gap-3 px-2 py-2">
              <span className="flex min-w-0 flex-col">
                <span className="break-words">{product.name}</span>
                <span className="text-xs text-muted-foreground">
                  {product.stock} {PRODUCT_UNIT} left
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
