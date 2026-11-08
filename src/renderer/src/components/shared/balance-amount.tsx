import { formatCurrency } from '@/lib/format'

// Shows what a customer owes. Positive = they owe us, negative = they have paid ahead.
export function BalanceAmount({ amount }: { amount: number }): React.JSX.Element {
  if (amount > 0) return <span className="text-destructive">{formatCurrency(amount)}</span>
  if (amount < 0)
    return <span className="text-success">Received {formatCurrency(-amount)} extra</span>
  return <span className="text-success">Nothing due</span>
}
