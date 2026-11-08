import type { Category } from '@shared/categories/types'

// The ONLY file that calls window.api.categories.*. It sends the request and gives back the raw
// answer: checking it is done by the hooks (useApiQuery / useApiMutation).
// The backend routes behind these are listed in src/main/modules/categories/categories.ipc.ts.
export const categoriesApi = {
  list: () => window.api.categories.list(),
  add: (name: string) => window.api.categories.add({ name }),
  rename: (category: Pick<Category, 'id' | 'name'>) => window.api.categories.rename(category),
  remove: (id: string) => window.api.categories.remove(id)
}
