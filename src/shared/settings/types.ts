import type { z } from 'zod'

import type { saveSettingsSchema } from './schema'
import type { settings } from './table'

export type ShopSettings = Omit<typeof settings.$inferSelect, 'id'>

export type SaveSettingsInput = z.infer<typeof saveSettingsSchema>
