import type { AddCategoryInput, Category, RenameCategoryInput } from '@shared/categories/types'
import { call } from './call'

// The categories calls the screen is allowed to make. The names on the right are the backend
// routes in src/main/modules/categories/categories.ipc.ts.
export const categoriesPreload = {
  list: () => call<Category[]>('categories:list'),
  add: (input: AddCategoryInput) => call<Category>('categories:add', input),
  rename: (input: RenameCategoryInput) => call<Category>('categories:rename', input),
  remove: (id: string) => call<void>('categories:remove', { id })
}
