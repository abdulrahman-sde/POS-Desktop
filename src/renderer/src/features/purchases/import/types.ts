// One line read from a supplier's invoice.
export type ExtractedLine = {
  id: string
  no: number // the item number printed on the invoice
  category: string // the heading the line sits under on the invoice. Empty = no heading
  name: string // exactly as written on the invoice
  qty: number
  costPrice: number // price of ONE piece
}

export type ExtractedInvoice = {
  fileName: string
  total: number // the total printed on the invoice, used to check the lines were read correctly
  skipped: { no: number; name: string; amount: number }[] // lines left out on purpose (parcel / shipping). Never stored
  lines: ExtractedLine[]
}

// Extra details the owner can add to a NEW product with "Add details". Everything is optional.
export type NewProductDetails = {
  brand: string
  salePrice: number | null // null = we add 15% to the cost price
  reorderLevel: number
  shelf: string
}

// One row of the review page. Everything on it can be edited, because reading a PDF is never perfect.
export type ImportRow = {
  id: string
  no: number // the invoice's own item number, so rows can be found on the PDF
  invoiceName: string // as printed on the invoice, never changed
  name: string // for a new product: its name (editable)
  heading: string // the invoice's category heading for this line. Shown in the list and never changes, so the list never reshuffles
  category: string // the category the product will be saved in. Starts as the heading; "Add details" can change it
  qty: number
  costPrice: number
  productId: string | null // set = one of your products. null = a new product
  included: boolean // false = removed from this import
  details: NewProductDetails
}

// What the review page hands to the bill.
export type ImportEntry = { productId: string; qty: number; costPrice: number }
