import type { QtyPriceHeaderProps } from './types'
import { useState } from 'react'
import { Add, Minus, Trash } from 'reicon-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency, toNumber } from '@/lib/format'

// Widths shared by the headings and the rows, so they always line up.
const priceColumn = 'w-20 shrink-0'
const totalColumn = 'min-w-20 shrink-0 text-right whitespace-nowrap'

type QtyPriceRowProps = {
  name: string
  qty: number
  max?: number // the most that can be added (what is in stock). Buy Stock has no limit
  price: number // price of ONE piece
  onQtyChange: (qty: number) => void
  onPriceChange: (price: number) => void
  onRemove: () => void
}

// The controls of one cart line: [ - 2 + ]  Rs [ 600 ]  Rs 1,200  [bin]  (quantity, price of one piece, line total, remove)
// Everything updates while you type, so the total on the right is always up to date.
// Used by New Sale (selling price) and Buy Stock (cost price).
export function QtyPriceRow({
  name,
  qty,
  max,
  price,
  onQtyChange,
  onPriceChange,
  onRemove
}: QtyPriceRowProps): React.JSX.Element {
  // While a field is being typed in, it shows exactly what was typed (even empty). When you leave it, it shows the real value again.
  const [qtyDraft, setQtyDraft] = useState<string | null>(null)
  const [priceDraft, setPriceDraft] = useState<string | null>(null)
  const atMax = max !== undefined && qty >= max
  // One id, so clicking again replaces the message instead of stacking another.
  const warnMax = (limit: number): void => {
    toast.error(`Only ${limit} in stock`, { id: 'qty-limit' })
  }

  return (
    <div className="flex items-center gap-2">
      <div className="mr-auto flex items-center gap-0.5">
        <Button
          variant="outline"
          size="icon-xs"
          aria-label="Decrease quantity"
          disabled={qty <= 1}
          onClick={() => onQtyChange(qty - 1)}
        >
          <Minus />
        </Button>
        <Input
          type="text"
          inputMode="numeric"
          value={qtyDraft ?? String(qty)}
          aria-label={`Quantity of ${name}`}
          className="h-6 w-11 px-1 text-center"
          onFocus={(event) => event.target.select()}
          onChange={(event) => {
            // Whole numbers only. Past the stock it stops at the stock and says so.
            const digits = event.target.value.replace(/\D/g, '')
            let next = Number(digits)
            if (max !== undefined && next > max) {
              next = max
              warnMax(max)
            }
            setQtyDraft(digits === '' ? '' : String(next))
            if (next > 0) onQtyChange(next)
          }}
          onBlur={() => {
            // Typing 0 and leaving the box takes the item off the list.
            if (qtyDraft !== null && qtyDraft.trim() !== '' && toNumber(qtyDraft) === 0)
              onQtyChange(0)
            setQtyDraft(null)
          }}
        />
        <Button
          variant="outline"
          size="icon-xs"
          aria-label="Increase quantity"
          aria-disabled={atMax}
          className={atMax ? 'opacity-50' : undefined}
          onClick={() => (atMax ? warnMax(max) : onQtyChange(qty + 1))}
        >
          <Add />
        </Button>
      </div>

      <div className={priceColumn + ' relative'}>
        <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-xs text-muted-foreground">
          Rs
        </span>
        <Input
          type="number"
          inputMode="decimal"
          step="any"
          min={0}
          value={priceDraft ?? String(price)}
          aria-label={`Price of ${name}`}
          className="h-6 pr-1 pl-7"
          onFocus={(event) => event.target.select()}
          onChange={(event) => {
            setPriceDraft(event.target.value)
            onPriceChange(toNumber(event.target.value))
          }}
          onBlur={() => setPriceDraft(null)}
        />
      </div>

      <span className={totalColumn + ' text-sm'}>{formatCurrency(qty * price)}</span>

      {/* The bin is the last thing on the line, so it clearly belongs to this row. One tap removes the item. */}
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label={`Remove ${name}`}
        title="Remove"
        onClick={onRemove}
      >
        <Trash />
      </Button>
    </div>
  )
}

// The two column headings that sit above the first line, right-aligned with the price and total columns.
export function QtyPriceHeader({ priceLabel, onClear }: QtyPriceHeaderProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-end gap-2 px-4 pt-3 text-xs text-muted-foreground">
      {onClear ? (
        <Button variant="ghost" size="xs" className="mr-auto" onClick={onClear}>
          Clear
        </Button>
      ) : null}
      <span className={priceColumn}>{priceLabel}</span>
      <span className={totalColumn}>Total</span>
      <span className="w-6 shrink-0" />
    </div>
  )
}
