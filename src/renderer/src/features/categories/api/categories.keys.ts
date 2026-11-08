// Names for the categories data in the cache. A write hook that changes categories "invalidates"
// categoryKeys.all, and every screen showing categories refreshes by itself.
export const categoryKeys = {
  all: ['categories'] as const,
  list: () => [...categoryKeys.all, 'list'] as const
}
