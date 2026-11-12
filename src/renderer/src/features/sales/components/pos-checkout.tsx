import { useState } from 'react'
import { Add } from 'reicon-react'

import { FormField } from '@/components/shared/form-field'
import { useCustomers } from '@/features/customers/hooks/use-customers'
import { SearchableSelect } from '@/components/shared/searchable-select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CustomerFormDialog } from '@/features/customers/components/customer-form-dialog'
import { formatCurrency } from '@/lib/format'
import { WALK_IN, type PosCart } from '../hooks/use-pos-cart'

type PosCheckoutProps = {
  cart: PosCart
  onSubmit: () => void
}

function SummaryRow({
  label,
  value,
  muted
}: {
  label: string
  value: string
  muted?: boolean
}): React.JSX.Element {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={muted ? 'text-muted-foreground' : undefined}>{value}</span>
    </div>
  )
}

export function PosCheckout({ cart, onSubmit }: PosCheckoutProps): React.JSX.Element {
  const { customers } = useCustomers()
  const [newCustomerOpen, setNewCustomerOpen] = useState(false)

  return (
    // The details area is white, so it stands apart from the grey list of items above it.
    // Kept small on purpose, so the cart above gets the room.
    <div className="flex flex-col gap-2.5 border-t border-foreground/10 bg-background p-3">
      <FormField label="Customer" htmlFor="pos-customer">
        <div className="flex gap-2">
          <SearchableSelect
            id="pos-customer"
            value={cart.customerId}
            onValueChange={cart.selectCustomer}
            options={[
              { value: WALK_IN, label: 'Walk-in customer' },
              ...customers.map((c) => ({ value: c.id, label: c.name, keywords: c.phone }))
            ]}
          />
          <Button
            variant="outline"
            size="icon"
            aria-label="Add new customer"
            onClick={() => setNewCustomerOpen(true)}
          >
            <Add />
          </Button>
        </div>
        {cart.previousBalance > 0 ? (
          <p className="text-xs text-muted-foreground">
            Already owes you {formatCurrency(cart.previousBalance)} from earlier.
          </p>
        ) : null}
      </FormField>

      <div className="grid grid-cols-5 gap-2">
        <div className="col-span-2">
          <FormField label="Discount (Rs)" htmlFor="pos-discount">
            <Input
              id="pos-discount"
              type="number"
              inputMode="decimal"
              step="any"
              min={0}
              placeholder="0"
              value={cart.discountInput}
              onChange={(event) => cart.setDiscountInput(event.target.value)}
            />
          </FormField>
        </div>
        <div className="col-span-3">
          <FormField label="Money received (Rs)" htmlFor="pos-advance">
            <div className="relative">
              <Input
                id="pos-advance"
                type="number"
                inputMode="decimal"
                step="any"
                min={0}
                className="pr-24"
                value={cart.advanceInput ?? String(cart.advance)}
                onFocus={(event) => event.target.select()}
                onChange={(event) => cart.setAdvanceInput(event.target.value)}
              />
              <Button
                variant="outline"
                size="xs"
                className="absolute inset-y-0 right-1 my-auto"
                onClick={() => cart.setAdvanceInput(null)}
              >
                Full amount
              </Button>
            </div>
          </FormField>
        </div>
      </div>

      <div className="flex flex-col gap-0.5 rounded-lg bg-muted px-3 py-2">
        {cart.discount > 0 ? (
          <>
            <SummaryRow label="Subtotal" value={formatCurrency(cart.subtotal)} muted />
            <SummaryRow label="Discount" value={`-${formatCurrency(cart.discount)}`} muted />
          </>
        ) : null}
        <div className="flex items-center justify-between">
          <span>Total</span>
          <span className="text-lg">{formatCurrency(cart.total)}</span>
        </div>
        <SummaryRow label="Money received" value={formatCurrency(cart.advance)} />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Still to pay</span>
          <span className={cart.due > 0 ? 'text-destructive' : 'text-muted-foreground'}>
            {formatCurrency(cart.due)}
          </span>
        </div>
      </div>

      <Button
        size="lg"
        className="h-10"
        disabled={cart.problem !== ''}
        title={cart.problem || undefined}
        onClick={onSubmit}
      >
        Create invoice
      </Button>
      <CustomerFormDialog
        open={newCustomerOpen}
        onOpenChange={setNewCustomerOpen}
        onSaved={(customer) => cart.selectCustomer(customer.id)}
      />
    </div>
  )
}
