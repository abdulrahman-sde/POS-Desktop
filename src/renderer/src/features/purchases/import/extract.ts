import { parseInvoice, type PdfText } from './parse-invoice'
import { pdfjs } from './pdf'
import type { ExtractedInvoice } from './types'

// Reads a supplier's PDF invoice on this computer and returns its items, with their category headings and item
// numbers. Nothing is sent anywhere. Throws if the file does not look like a supported invoice.
export async function extractInvoice(file: File): Promise<ExtractedInvoice> {
  const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) })
  try {
    const doc = await task.promise
    const pages: PdfText[][] = []
    for (let number = 1; number <= doc.numPages; number++) {
      const { items } = await (await doc.getPage(number)).getTextContent()
      pages.push(
        items.flatMap((item) =>
          'str' in item
            ? [{ x: item.transform[4], y: item.transform[5], h: item.height, t: item.str }]
            : []
        )
      )
    }
    return parseInvoice(pages, file.name)
  } finally {
    void task.destroy()
  }
}
