// Which Delete buttons are shown. A delete is always soft (the record goes to Settings > Deleted records and can be
// brought back); the backend, the dialogs and that page work for all four, so set one to true to show its button.
export const SHOW_DELETE = {
  customers: true,
  products: true,
  suppliers: false,
  categories: false
}
