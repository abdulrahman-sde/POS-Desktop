import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { toNumber } from '@/lib/format'
import { cn } from '@/lib/utils'

type EditableNumberProps = {
  value: number
  onChange: (value: number) => void
  label: string // read by screen readers
  prefix?: string // e.g. "Rs"
  className?: string
}

// A number box inside a table row. The row updates on every keystroke. While you type, the box shows exactly what you
// typed (even empty); when you leave it, it shows the real value again.
export function EditableNumber({
  value,
  onChange,
  label,
  prefix,
  className
}: EditableNumberProps): React.JSX.Element {
  const [draft, setDraft] = useState<string | null>(null)
  return (
    <div className={cn('relative', className)}>
      {prefix ? (
        <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-xs text-muted-foreground">
          {prefix}
        </span>
      ) : null}
      <Input
        type="number"
        inputMode="decimal"
        min={0}
        value={draft ?? String(value)}
        aria-label={label}
        className={cn(
          'h-8 border-border px-1.5 text-center text-sm focus-visible:border-border focus-visible:bg-background',
          prefix && 'pl-8'
        )}
        onFocus={(event) => event.target.select()}
        onChange={(event) => {
          setDraft(event.target.value)
          onChange(toNumber(event.target.value))
        }}
        onBlur={() => setDraft(null)}
      />
    </div>
  )
}
