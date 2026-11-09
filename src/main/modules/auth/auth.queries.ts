import { eq } from 'drizzle-orm'

import { auth } from '@shared/schema'
import type { DbOrTx } from '../../db/connection'

const ROW_ID = 1

export const findAuth = (db: DbOrTx) => db.select().from(auth).where(eq(auth.id, ROW_ID)).get()

export const saveAuthRow = (db: DbOrTx, values: { salt: string; hash: string }) =>
  db
    .insert(auth)
    .values({ id: ROW_ID, ...values })
    .onConflictDoUpdate({ target: auth.id, set: values })
    .run()
