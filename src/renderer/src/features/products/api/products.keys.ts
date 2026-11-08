// Names for the products data in the cache. A write hook that changes products "invalidates"
// productKeys.all, and every screen showing products (table, New Sale tiles, Buy Stock search)
// refreshes by itself.
export const productKeys = {
  all: ['products'] as const,
  list: () => [...productKeys.all, 'list'] as const
}
