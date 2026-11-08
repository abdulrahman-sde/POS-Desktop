import { Link } from 'react-router'

import { BalanceAmount } from '@/components/shared/balance-amount'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CustomerRow } from '@/features/customers/types'

export function CustomersOwingCard({ rows }: { rows: CustomerRow[] }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers who owe you</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link to="/customers" />}>
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col divide-y">
        {rows.length === 0 ? (
          <p className="py-2 text-muted-foreground">Nobody owes you anything.</p>
        ) : (
          rows.map(({ customer, balance }) => (
            <Link
              key={customer.id}
              to={`/customers/${customer.id}`}
              className="flex items-center justify-between gap-3 py-2 hover:bg-muted/50"
            >
              <span className="break-words">{customer.name}</span>
              <BalanceAmount amount={balance} />
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  )
}
