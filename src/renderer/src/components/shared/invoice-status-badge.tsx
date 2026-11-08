import { Badge } from '@/components/ui/badge'
import type { InvoiceStatus } from '@/features/sales/types'

const config: Record<
  InvoiceStatus,
  { label: string; variant: 'success' | 'warning' | 'destructive' }
> = {
  paid: { label: 'Paid', variant: 'success' },
  partial: { label: 'Part paid', variant: 'warning' },
  unpaid: { label: 'Not paid', variant: 'destructive' }
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }): React.JSX.Element {
  const { label, variant } = config[status]
  return <Badge variant={variant}>{label}</Badge>
}
