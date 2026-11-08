import { CategoryChip } from '@/components/shared/category-chip'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { PRODUCT_UNIT, type Product } from '@/features/products/types'
import { formatCurrency } from '@/lib/format'

type MatchedProductDialogProps = {
  product: Product | null // the dialog is open while this is set
  invoiceName: string
  onOpenChange: (open: boolean) => void
  onChange: () => void // "Change product"
}

function Figure({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg bg-muted px-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-base whitespace-nowrap">{value}</span>
    </div>
  )
}

// The product matched to an invoice item. Top to bottom: the product (large) and its category, three key figures,
// a small line with what the invoice called it, then the buttons.
export function MatchedProductDialog({
  product,
  invoiceName,
  onOpenChange,
  onChange
}: MatchedProductDialogProps): React.JSX.Element {
  const extra = product
    ? [product.brand, product.shelf ? `Shelf ${product.shelf}` : ''].filter(Boolean).join(' · ')
    : ''

  return (
    <Dialog open={product !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {product ? (
          <>
            <DialogHeader className="gap-2">
              <p className="text-xs text-muted-foreground">Matched product</p>
              <DialogTitle className="text-lg leading-snug break-words">{product.name}</DialogTitle>
              <div className="flex flex-wrap items-center gap-2">
                <CategoryChip name={product.category} />
                {extra ? <span className="text-xs text-muted-foreground">{extra}</span> : null}
              </div>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-2">
              <Figure label="In stock" value={`${product.stock} ${PRODUCT_UNIT}`} />
              <Figure label="Cost price" value={formatCurrency(product.costPrice)} />
              <Figure label="Selling price" value={formatCurrency(product.salePrice)} />
            </div>

            <p className="text-xs text-muted-foreground">On the invoice: {invoiceName}</p>

            <DialogFooter>
              <Button variant="outline" onClick={onChange}>
                Change product
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
