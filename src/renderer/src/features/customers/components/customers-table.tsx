import { Users } from 'reicon-react'
import { Link, useNavigate } from 'react-router'

import { BalanceAmount } from '@/components/shared/balance-amount'
import { EmptyState } from '@/components/shared/empty-state'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { formatDate } from '@/lib/format'
import type { CustomerRow } from '../types'

export function CustomersTable({ rows }: { rows: CustomerRow[] }): React.JSX.Element {
  const navigate = useNavigate()

  return (
    <Card className="gap-0 px-3 py-1">
      {rows.length === 0 ? (
        <EmptyState icon={Users} title="No customers found" description="Try a different search." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Address</TableHead>
              <TableHead className="hidden lg:table-cell">Last order</TableHead>
              <TableHead className="text-right">Owes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ customer, balance, lastOrderAt }) => (
              <TableRow
                key={customer.id}
                className="cursor-pointer"
                onClick={() => navigate(`/customers/${customer.id}`)}
              >
                <TableCell>
                  <div className="flex flex-col">
                    <Link
                      to={`/customers/${customer.id}`}
                      className="hover:underline"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {customer.name}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {customer.phone || 'No phone'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {customer.address || '-'}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">
                  {lastOrderAt ? formatDate(lastOrderAt) : 'No orders yet'}
                </TableCell>
                <TableCell className="text-right">
                  <BalanceAmount amount={balance} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  )
}
