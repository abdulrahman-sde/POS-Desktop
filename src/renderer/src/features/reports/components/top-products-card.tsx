import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'

type TopProductsCardProps = {
  products: { name: string; qty: number; revenue: number; unit: string }[]
}

export function TopProductsCard({ products }: TopProductsCardProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Best selling products</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col divide-y">
        {products.length === 0 ? (
          <p className="py-2 text-muted-foreground">No sales in this period.</p>
        ) : (
          products.map((product) => (
            <div key={product.name} className="flex items-center justify-between gap-3 py-2">
              <span className="flex min-w-0 flex-col">
                <span className="break-words">{product.name}</span>
                <span className="text-xs text-muted-foreground">
                  {product.qty} {product.unit} sold
                </span>
              </span>
              <span className="shrink-0 whitespace-nowrap">{formatCurrency(product.revenue)}</span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
