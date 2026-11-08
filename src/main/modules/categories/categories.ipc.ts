import {
  addCategorySchema,
  categoryIdSchema,
  renameCategorySchema
} from '@shared/categories/schema'
import { handle } from '../../lib/ipc'
import * as service from './categories.service'

// The routes (endpoints) of the categories module. The renderer reaches them through
// preload/modules/categories.ts. To see everything categories can do, read this file.
export function registerCategoriesIpc(): void {
  handle('categories:list', null, () => service.listCategories())
  handle('categories:add', addCategorySchema, (input) => service.addCategory(input))
  handle('categories:rename', renameCategorySchema, (input) => service.renameCategory(input))
  handle('categories:remove', categoryIdSchema, ({ id }) => service.deleteCategory(id))
}
