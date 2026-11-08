import { Badge } from '@/components/ui/badge'
import { getStockLevel, type Product } from '@/features/products/types'

export function StockBadge({ product }: { product: Product }): React.JSX.Element {
  const level = getStockLevel(product)
  if (level === 'out') return <Badge variant="destructive">Out of stock</Badge>
  if (level === 'low') return <Badge variant="warning">Low stock</Badge>
  return <Badge variant="success">In stock</Badge>
}
