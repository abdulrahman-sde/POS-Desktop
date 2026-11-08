import { z } from 'zod'

import { deletedKinds } from './constants'

export const restoreSchema = z.object({
  kind: z.enum(deletedKinds),
  id: z.string().min(1)
})
