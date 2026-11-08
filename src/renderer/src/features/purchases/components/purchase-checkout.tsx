import { useState } from 'react'
import { Add } from 'reicon-react'

import { useData } from '@/app/providers/data-context'
import { FormField } from '@/components/shared/form-field'
import { OptionSelect } from '@/components/shared/option-select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SupplierFormDialog } from '@/features/suppliers/components/supplier-form-dialog'
import { paymentMethodLabels, type PaymentMethod } from '@/features/sales/types'
import { formatCurrency } from '@/lib/format'
import type { PurchaseCart } from '../hooks/use-purchase-cart'

const methodOptions = (Object.keys(paymentMethodLabels) as PaymentMethod[]).map((value) => ({
  value,
  label: paymentMethodLabels[value]
}))

export function PurchaseCheckout({
  cart,
  onSubmit
}: {
  cart: PurchaseCart
  onSubmit: () => void
}): React.JSX.Element {
  const { suppliers } = useData()
  const [newSupplierOpen, setNewSupplierOpen] = useState(false)

  return (
    <div className="flex flex-col gap-2.5 border-t border-foreground/10 bg-background p-3">
      <FormField label="Supplier" htmlFor="buy-supplier">
        <div className="flex gap-2">
          <OptionSelect
            id="buy-supplier"
            value={cart.supplierId}
            onValueChange={cart.setSupplierId}
            placeholder="Choose a supplier"
            options={suppliers.map((s) => ({ value: s.id, label: s.name }))}
          />
          <Button
            variant="outline"
            size="icon"
            aria-label="Add new supplier"
            onClick={() => setNewSupplierOpen(true)}
          >
            <Add />
          </Button>
        </div>
        {cart.alreadyOwed > 0 ? (
          <p className="text-xs text-muted-foreground">
            You already owe them {formatCurrency(cart.alreadyOwed)}.
          </p>
        ) : null}
      </FormField>

      <FormField label="Money paid (Rs)" htmlFor="buy-paid">
        <div className="relative">
          <Input
            id="buy-paid"
            type="number"
            inputMode="decimal"
            min={0}
            className="pr-24"
            value={cart.paidInput ?? String(cart.paid)}
            onFocus={(event) => event.target.select()}
            onChange={(event) => cart.setPaidInput(event.target.value)}
          />
          <Button
            variant="outline"
            size="xs"
            className="absolute inset-y-0 right-1 my-auto"
            onClick={() => cart.setPaidInput(null)}
          >
            Full amount
          </Button>
        </div>
      </FormField>
      <p className="text-xs text-muted-foreground">Leave 0 if you will pay later.</p>

      {/* Always shown (greyed out until money is paid), so the panel never changes size */}
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="buy-method">How did you pay?</Label>
        <OptionSelect
          id="buy-method"
          className="w-40"
          disabled={cart.paid <= 0}
          value={cart.method}
          onValueChange={(value) => cart.setMethod(value as PaymentMethod)}
          options={methodOptions}
        />
      </div>

      <div className="flex flex-col gap-0.5 rounded-lg bg-muted px-3 py-2">
        <div className="flex items-center justify-between">
          <span>Total</span>
          <span className="text-lg">{formatCurrency(cart.total)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Money paid</span>
          <span>{formatCurrency(cart.paid)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Still to pay</span>
          <span className={cart.due > 0 ? 'text-destructive' : 'text-muted-foreground'}>
            {formatCurrency(cart.due)}
          </span>
        </div>
      </div>

      <Button size="lg" className="h-10" disabled={cart.problem !== ''} onClick={onSubmit}>
        Add to stock
      </Button>

      <SupplierFormDialog
        open={newSupplierOpen}
        onOpenChange={setNewSupplierOpen}
        onSaved={(supplier) => cart.setSupplierId(supplier.id)}
      />
    </div>
  )
}
