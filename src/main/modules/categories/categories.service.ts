import { randomUUID } from 'crypto'

import type { AddCategoryInput, Category, RenameCategoryInput } from '@shared/categories/types'
import { getDb } from '../../db/connection'
import { UserError } from '../../lib/ipc'
import * as q from './categories.queries'

// The rules for categories. Anything that needs to look at the database before saving goes here.

export function listCategories(): Category[] {
  return q.listCategories(getDb())
}

export function addCategory(input: AddCategoryInput): Category {
  const db = getDb()
  const name = input.name.trim()
  if (q.findCategoryByName(db, name))
    throw new UserError('You already have a category with this name.')
  return q.insertCategory(db, { id: randomUUID(), name })
}

// Products point at the category by id, so renaming it here renames it everywhere.
export function renameCategory(input: RenameCategoryInput): Category {
  const db = getDb()
  const name = input.name.trim()
  if (!q.findCategoryById(db, input.id)) throw new UserError('This category no longer exists.')
  const same = q.findCategoryByName(db, name)
  if (same && same.id !== input.id)
    throw new UserError('You already have a category with this name.')
  return q.updateCategoryName(db, input.id, name)
}

export function deleteCategory(id: string): void {
  const db = getDb()
  const count = q.countProductsInCategory(db, id)
  if (count > 0) {
    throw new UserError(
      `This category has ${count} product${count === 1 ? '' : 's'}. Move or remove them first.`
    )
  }
  q.softDeleteCategory(db, id, new Date().toISOString())
}
