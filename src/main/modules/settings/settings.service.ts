import { DEFAULT_SETTINGS } from '@shared/settings/constants'
import type { SaveSettingsInput, ShopSettings } from '@shared/settings/types'
import { getDb, type DbOrTx } from '../../db/connection'
import * as q from './settings.queries'

function toShopSettings(row: ShopSettings & { id?: number }): ShopSettings {
  return {
    shopName: row.shopName,
    ownerName: row.ownerName,
    phone: row.phone,
    address: row.address,
    countryCode: row.countryCode,
    invoiceNote: row.invoiceNote,
    defaultReorderLevel: row.defaultReorderLevel,
    defaultMarkupPercent: row.defaultMarkupPercent
  }
}

export function readSettings(db: DbOrTx): ShopSettings {
  const row = q.findSettings(db)
  return row ? toShopSettings(row) : DEFAULT_SETTINGS
}

export function getSettings(): ShopSettings {
  return readSettings(getDb())
}

export function saveSettings(input: SaveSettingsInput): ShopSettings {
  return toShopSettings(q.saveSettingsRow(getDb(), input))
}
