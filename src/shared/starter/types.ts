import type { z } from 'zod'

import type { starterFileSchema } from './schema'

export type StarterFile = z.output<typeof starterFileSchema>

export type StarterStatus = { imported: boolean; importedAt: string | null }

export type StarterChoice = { chosen: false } | { chosen: true; result: StarterResult }

export type StarterResult = {
  customers: number
  suppliers: number
  products: number
  categories: number
  skipped: number // names that were already in the app
  notOnWhatsApp: string[] // customers whose phone cannot open a WhatsApp chat
}
