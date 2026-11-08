import { format, isSameDay as dfIsSameDay, isSameMonth as dfIsSameMonth, parseISO } from 'date-fns'

const numberFormat = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 })

export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount)
  return `${rounded < 0 ? '-' : ''}Rs ${numberFormat.format(Math.abs(rounded))}`
}

export function formatDate(iso: string): string {
  return format(parseISO(iso), 'dd MMM yyyy')
}

export function formatDateTime(iso: string): string {
  return format(parseISO(iso), 'dd MMM yyyy, HH:mm')
}

export function formatShortDate(date: Date): string {
  return format(date, 'd MMM')
}

export function formatWeekdayDate(date: Date): string {
  return format(date, 'EEE d MMM')
}

export function isSameDay(a: string | Date, b: string | Date): boolean {
  return dfIsSameDay(a, b)
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

export function toDateInput(date: Date = new Date()): string {
  return format(date, 'yyyy-MM-dd')
}

export function fromDateInput(value: string): string {
  return parseISO(`${value}T12:00:00`).toISOString()
}

export function isSameMonth(a: string | Date, b: string | Date): boolean {
  return dfIsSameMonth(a, b)
}
