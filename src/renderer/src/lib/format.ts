const numberFormat = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 })

export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount)
  return `${rounded < 0 ? '-' : ''}Rs ${numberFormat.format(Math.abs(rounded))}`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export function formatDateTime(iso: string): string {
  const time = new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return `${formatDate(iso)}, ${time}`
}

export function daysAgo(days: number, hour = 12): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(hour, 0, 0, 0)
  return date.toISOString()
}

export function isSameDay(a: string | Date, b: string | Date): boolean {
  return new Date(a).toDateString() === new Date(b).toDateString()
}

export function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? '' : 's'}`
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

export function toNumber(value: string): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

// "2026-11-07" for <input type="date">, in local time.
export function toDateInput(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function fromDateInput(value: string): string {
  return new Date(`${value}T12:00:00`).toISOString()
}

export function isSameMonth(a: string | Date, b: string | Date): boolean {
  const first = new Date(a)
  const second = new Date(b)
  return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth()
}
