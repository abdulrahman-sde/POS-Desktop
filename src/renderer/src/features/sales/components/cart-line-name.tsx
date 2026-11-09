import { useState } from 'react'
import { Edit } from 'reicon-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { CartLineNameProps } from '../types'

// The item name on a cart line. The pencil lets the owner change what THIS invoice says;
// the product keeps its own name, so stock, reports and invoice import are not affected.
export function CartLineName({
  name,
  productName,
  onChange
}: CartLineNameProps): React.JSX.Element {
  const [draft, setDraft] = useState<string | null>(null)
  const renamed = name !== productName

  if (draft !== null) {
    return (
      <div className="flex flex-col gap-1">
        <Input
          autoFocus
          maxLength={120}
          value={draft}
          aria-label="Name on the invoice"
          className="h-7"
          onFocus={(event) => event.target.select()}
          onChange={(event) => {
            setDraft(event.target.value)
            onChange(event.target.value)
          }}
          onBlur={() => setDraft(null)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur()
            if (event.key === 'Escape') {
              onChange(name)
              setDraft(null)
            }
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm break-words">{name}</p>
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label="Change the name on the invoice"
          title="Change the name on the invoice"
          onClick={() => setDraft(name)}
        >
          <Edit />
        </Button>
      </div>
      {renamed ? <p className="text-xs text-muted-foreground">Product: {productName}</p> : null}
    </div>
  )
}
