import { useState } from 'react'

import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency } from '@/lib/format'
import { useElementWidth } from '../hooks/use-element-width'

type Day = { date: Date; total: number; orders: number }

const HEIGHT = 240
const MARGIN = { top: 28, right: 24, bottom: 30, left: 52 }

// A "nice" top for the y axis (1, 2, 2.5, 5 or 10 times a power of ten), split into 4 steps.
function niceMax(max: number): number {
  const rough = Math.max(max, 1) / 4
  const power = Math.pow(10, Math.floor(Math.log10(rough)))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => s >= rough) ?? rough
  return step * 4
}

function compact(value: number): string {
  return value >= 1000 ? `${Math.round((value / 1000) * 10) / 10}k` : String(value)
}

const shortDate = (date: Date): string =>
  date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

// One line: sales per day. One series, so no legend; the card title names it.
// Colours come from design tokens (the line is --primary). The Table tab shows the same
// numbers as text, so nothing depends on hovering.
export function SalesLineChart({ days }: { days: Day[] }): React.JSX.Element {
  const [view, setView] = useState<'chart' | 'table'>('chart')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales by day</CardTitle>
        <CardAction>
          <Tabs value={view} onValueChange={(value) => setView(value as 'chart' | 'table')}>
            <TabsList>
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardAction>
      </CardHeader>
      <CardContent>
        {view === 'chart' ? <LineChart days={days} /> : <DaysTable days={days} />}
      </CardContent>
    </Card>
  )
}

function LineChart({ days }: { days: Day[] }): React.JSX.Element {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const [active, setActive] = useState<number | null>(null)

  const top = niceMax(Math.max(...days.map((d) => d.total)))
  const plotW = Math.max(width - MARGIN.left - MARGIN.right, 1)
  const plotH = HEIGHT - MARGIN.top - MARGIN.bottom
  const x = (index: number): number =>
    MARGIN.left + (days.length === 1 ? plotW / 2 : (index / (days.length - 1)) * plotW)
  const y = (value: number): number => MARGIN.top + plotH * (1 - value / top)
  const ticks = [0, 1, 2, 3, 4].map((i) => (top / 4) * i)

  const path = days.map((day, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(day.total)}`).join(' ')
  const showAllDots = days.length <= 10
  const labelEvery = days.length > 10 ? 5 : 1
  const last = days.length - 1
  const activeDay = active !== null ? days[active] : null

  const nearest = (clientX: number, left: number): number => {
    const position = clientX - left - MARGIN.left
    const index = Math.round((position / plotW) * (days.length - 1))
    return Math.min(Math.max(index, 0), days.length - 1)
  }

  return (
    <div
      ref={ref}
      className="relative w-full rounded-md outline-none "
      tabIndex={0}
      role="group"
      aria-label="Line chart of sales by day. Use the left and right arrow keys to read each day, or open the Table tab."
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') setActive((a) => Math.min((a ?? -1) + 1, last))
        if (event.key === 'ArrowLeft') setActive((a) => Math.max((a ?? days.length) - 1, 0))
        if (event.key === 'Escape') setActive(null)
      }}
      onBlur={() => setActive(null)}
    >
      {width > 0 ? (
        <svg
          width={width}
          height={HEIGHT}
          className="block touch-none select-none"
          aria-hidden="true"
          onPointerMove={(event) =>
            setActive(nearest(event.clientX, event.currentTarget.getBoundingClientRect().left))
          }
          onPointerLeave={() => setActive(null)}
        >
          {/* grid and y axis labels: hairlines, quiet */}
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={MARGIN.left}
                x2={width - MARGIN.right}
                y1={y(tick)}
                y2={y(tick)}
                className="stroke-foreground/10"
                strokeWidth={1}
              />
              <text
                x={MARGIN.left - 8}
                y={y(tick)}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-muted-foreground text-xs"
              >
                {tick === 0 ? '0' : `Rs ${compact(tick)}`}
              </text>
            </g>
          ))}

          {/* x axis labels */}
          {days.map((day, i) =>
            i % labelEvery === 0 || i === last ? (
              <text
                key={i}
                x={x(i)}
                y={HEIGHT - 8}
                textAnchor="middle"
                className="fill-muted-foreground text-xs"
              >
                {shortDate(day.date)}
              </text>
            ) : null
          )}

          {/* crosshair */}
          {active !== null ? (
            <line
              x1={x(active)}
              x2={x(active)}
              y1={MARGIN.top}
              y2={MARGIN.top + plotH}
              className="stroke-foreground/25"
              strokeWidth={1}
            />
          ) : null}

          {/* the line */}
          <path
            d={path}
            fill="none"
            className="stroke-primary"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* markers: 8px dots with a in the card colour */}
          {days.map((day, i) =>
            showAllDots || i === last || i === active ? (
              <circle
                key={i}
                cx={x(i)}
                cy={y(day.total)}
                r={i === active ? 5 : 4}
                className="fill-primary stroke-card"
                strokeWidth={2}
              />
            ) : null
          )}

          {/* the one direct label: the latest value */}
          {active === null ? (
            <text
              x={x(last)}
              y={y(days[last].total) - 12}
              textAnchor="end"
              className="fill-foreground text-xs"
            >
              {formatCurrency(days[last].total)}
            </text>
          ) : null}
        </svg>
      ) : null}

      {activeDay && active !== null ? (
        <div
          role="status"
          className="pointer-events-none absolute top-0 z-10 flex min-w-32 flex-col gap-0.5 rounded-lg bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md border border-foreground/10"
          style={{
            left: Math.min(Math.max(x(active), 70), width - 70),
            transform: 'translateX(-50%)'
          }}
        >
          <span className="text-muted-foreground">
            {activeDay.date.toLocaleDateString('en-GB', {
              weekday: 'short',
              day: 'numeric',
              month: 'short'
            })}
          </span>
          <span className="flex items-center gap-1.5 text-sm">
            <span className="h-0.5 w-3 rounded-full bg-primary" />
            {formatCurrency(activeDay.total)}
          </span>
          <span className="text-muted-foreground">
            {activeDay.orders === 1 ? '1 order' : `${activeDay.orders} orders`}
          </span>
        </div>
      ) : null}
    </div>
  )
}

function DaysTable({ days }: { days: Day[] }): React.JSX.Element {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Day</TableHead>
          <TableHead className="text-right">Orders</TableHead>
          <TableHead className="text-right">Sold</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...days].reverse().map((day) => (
          <TableRow key={day.date.toISOString()}>
            <TableCell>
              {day.date.toLocaleDateString('en-GB', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
              })}
            </TableCell>
            <TableCell className="text-right text-muted-foreground">{day.orders}</TableCell>
            <TableCell className="text-right">{formatCurrency(day.total)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
