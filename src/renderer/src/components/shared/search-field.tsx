import { Search } from 'reicon-react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function SearchField({
  className,
  ...props
}: React.ComponentProps<typeof Input>): React.JSX.Element {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input type="search" className="pl-8" {...props} />
    </div>
  )
}
