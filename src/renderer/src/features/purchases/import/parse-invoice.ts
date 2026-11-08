import type { ExtractedInvoice, ExtractedLine } from './types'

// A piece of text on a PDF page. x and y are in PDF units: x grows to the right, y grows UPWARD (the top of the page has
// the biggest y). h is the text size.
export type PdfText = { x: number; y: number; h: number; t: string }

// Reads the table of a "bill by category" PDF (Crystal Reports). The layout it expects, measured from a real invoice:
//
//   Item# | Particulars (the name) | Qty | Rate | Amount        <- heading line, repeated on every page
//   Battery                                                     <- a category heading: alone on its line, slightly larger text
//   1  Speed J5PRIME G570            1    950.00   950.00      <- an item line
//   2  A long name that does not fit
//      on one line                   3  1,650.00 4,950.00      <- a name can wrap onto the next line
//                                    13           30,300.00    <- a subtotal line (no item number): ignored
//   ...
//   Qty: 241          Bill Total: 439,099.00                    <- the total, used to check we read everything
//
// The columns are found by where they sit across the page. If another supplier's PDF is laid out differently, this is
// the one place to adapt.
const COLUMN = {
  itemNo: { max: 45 }, // item numbers sit at the far left
  name: { min: 52, max: 255 }, // names and category headings
  qty: { min: 255, max: 303 },
  rate: { min: 303, max: 345 },
  amount: { min: 345 }
}
const HEADING_X = { min: 52, max: 58.5 } // a category heading starts a little further left than a name (57 vs 60)
const HEADING_MIN_SIZE = 7.5 // ...and is a little larger (7.8 vs 7.2)
const SAME_LINE = 2.5 // text whose heights differ by less than this is on one line
const WRAP_GAP = 13 // a wrapped name sits at most this far below the line above it

// A category heading that is not stock: parcel, shipping and similar charges. The heading and every line under it are
// skipped. They are not shown, not turned into a category or a product, and not stored anywhere. ("Parsal" is how this
// supplier spells parcel.) Add words here if another charge shows up.
export const SKIPPED_HEADINGS = ['parsal', 'parcel', 'shipping', 'freight', 'courier', 'delivery']
const isSkippedHeading = (heading: string): boolean =>
  SKIPPED_HEADINGS.some((word) => heading.toLowerCase().includes(word))

const isNumber = (text: string): boolean => /^-?[\d,]+(\.\d+)?$/.test(text.trim())
const toNumber = (text: string): number => Number(text.replace(/,/g, ''))

type Line = { y: number; items: PdfText[] }

// Text that sits at (nearly) the same height becomes one line, read left to right. Top of the page first.
function toLines(texts: PdfText[]): Line[] {
  const lines: Line[] = []
  for (const text of [...texts].sort((a, b) => b.y - a.y)) {
    const last = lines[lines.length - 1]
    if (last && Math.abs(last.y - text.y) <= SAME_LINE) last.items.push(text)
    else lines.push({ y: text.y, items: [text] })
  }
  for (const line of lines) line.items.sort((a, b) => a.x - b.x)
  return lines
}

export function parseInvoice(pages: PdfText[][], fileName: string): ExtractedInvoice {
  const lines: ExtractedLine[] = []
  const skipped: ExtractedInvoice['skipped'] = []
  let skipping = false // inside a skipped heading
  let heading = ''
  let current: ExtractedLine | null = null // the last item, which a wrapped name line belongs to
  let printedTotal: number | null = null

  for (const page of pages) {
    const rows = toLines(page.filter((text) => text.t.trim() !== ''))
    // The table starts under the "Item# ... Particulars" heading line. A page without one has no table.
    const start = rows.findIndex((row) => row.items.some((i) => i.t.trim() === 'Item#'))
    if (start < 0) continue
    let previousY = rows[start].y // where the line above is, to tell a wrapped name from something unrelated

    for (const row of rows.slice(start + 1)) {
      const text = (from: number, to = Infinity): PdfText[] =>
        row.items.filter((i) => i.x >= from && i.x < to)
      const rowText = row.items.map((i) => i.t).join(' ')

      // The end of the table: the totals.
      if (/Bill Total/i.test(rowText)) {
        const amount = row.items.filter((i) => i.x >= COLUMN.amount.min && isNumber(i.t)).pop()
        if (amount) printedTotal = toNumber(amount.t)
        break
      }

      const itemNo = row.items.find((i) => i.x < COLUMN.itemNo.max && /^\d+$/.test(i.t.trim()))
      const qty = text(COLUMN.qty.min, COLUMN.qty.max).find((i) => isNumber(i.t))
      const rate = text(COLUMN.rate.min, COLUMN.rate.max).find((i) => isNumber(i.t))
      const amount = text(COLUMN.amount.min).find((i) => isNumber(i.t))
      const nameParts = text(COLUMN.name.min, COLUMN.name.max)
      const name = nameParts
        .map((i) => i.t.trim())
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()

      if (itemNo && qty && amount) {
        const quantity = toNumber(qty.t)
        const total = toNumber(amount.t)
        current = {
          id: `l${itemNo.t.trim()}`,
          no: Number(itemNo.t),
          category: heading,
          name,
          qty: quantity,
          // The rate is the price of one piece. If it is missing, work it out from the amount.
          costPrice: rate ? toNumber(rate.t) : quantity > 0 ? total / quantity : 0
        }
        if (skipping) {
          skipped.push({ no: current.no, name: current.name, amount: total })
          current = null
        } else {
          lines.push(current)
        }
        previousY = row.y
        continue
      }

      if (qty || amount) continue // a subtotal line: numbers but no item number

      if (nameParts.length > 0 && !itemNo) {
        const first = nameParts[0]
        const isHeading =
          first.x >= HEADING_X.min &&
          first.x <= HEADING_X.max &&
          first.h >= HEADING_MIN_SIZE &&
          previousY - row.y > 0
        if (isHeading && nameParts.every((i) => i.h >= HEADING_MIN_SIZE)) {
          heading = name
          skipping = isSkippedHeading(name)
          current = null
        } else if (current && previousY - row.y <= WRAP_GAP) {
          // The rest of a long name, on the line below.
          current.name = `${current.name} ${name}`.trim()
          previousY = row.y
        }
      }
    }
  }

  if (lines.length === 0) throw new Error('No items found')

  return {
    fileName,
    // The total printed on the invoice. If it is not there, the sum of the items.
    total:
      printedTotal ??
      lines.reduce((sum, line) => sum + line.qty * line.costPrice, 0) +
        skipped.reduce((sum, line) => sum + line.amount, 0),
    skipped,
    lines
  }
}
