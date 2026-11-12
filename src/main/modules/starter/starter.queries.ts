import { eq } from 'drizzle-orm'

import { starterImport } from '@shared/schema'
import type { DbOrTx } from '../../db/connection'

// Only SQL lives here. No rules and no decisions: those are in starter.service.ts.

const ROW_ID = 1

export const findImport = (db: DbOrTx) =>
  db.select().from(starterImport).where(eq(starterImport.id, ROW_ID)).get()

export const insertImport = (db: DbOrTx, importedAt: string) =>
  db.insert(starterImport).values({ id: ROW_ID, importedAt }).run()
