import type { z } from 'zod'

import type { DeletedKind } from './constants'
import type { restoreSchema } from './schema'

export type { DeletedKind }

export type DeletedRecord = {
  id: string
  name: string
  detail: string
  deletedAt: string
}

export type DeletedRecords = {
  products: DeletedRecord[]
  customers: DeletedRecord[]
  suppliers: DeletedRecord[]
  categories: DeletedRecord[]
}

export type RestoreInput = z.infer<typeof restoreSchema>
