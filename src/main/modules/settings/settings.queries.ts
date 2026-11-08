import { eq } from 'drizzle-orm'

import { settings } from '@shared/schema'
import type { DbOrTx } from '../../db/connection'

const ROW_ID = 1

export const findSettings = (db: DbOrTx) =>
  db.select().from(settings).where(eq(settings.id, ROW_ID)).get()

export const saveSettingsRow = (db: DbOrTx, values: Omit<typeof settings.$inferInsert, 'id'>) =>
  db
    .insert(settings)
    .values({ id: ROW_ID, ...values })
    .onConflictDoUpdate({ target: settings.id, set: values })
    .returning()
    .get()
