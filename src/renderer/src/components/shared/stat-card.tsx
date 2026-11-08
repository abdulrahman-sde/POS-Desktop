import type { IconComponent } from 'reicon-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type Tone = 'primary' | 'success' | 'warning' | 'destructive' | 'info'

// Soft tinted backgrounds, all taken from the colour tokens in index.css.
export const toneClasses: Record<Tone, string> = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/15 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
  info: 'bg-info/10 text-info'
}

type StatCardProps = {
  label: string
  value: string
  hint?: string
  icon?: IconComponent
  tone?: Tone
}

// Nothing here is ever cut off with "...". The number stays on one line; if the card is too
// narrow to fit the icon beside it, the text drops under the icon instead.
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'primary'
}: StatCardProps): React.JSX.Element {
  return (
    <Card size="sm">
      <CardContent className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {Icon ? (
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-lg',
              toneClasses[tone]
            )}
          >
            <Icon className="size-5" />
          </div>
        ) : null}
        <div className="flex min-w-fit flex-1 flex-col">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-xl whitespace-nowrap">{value}</span>
          {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
        </div>
      </CardContent>
    </Card>
  )
}
