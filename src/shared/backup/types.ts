export type BackupResult = {
  saved: boolean
  path?: string
}

// What is inside a saved copy the owner picked, shown before anything is replaced.
export type BackupSummary = {
  fileName: string
  savedAt: string // ISO date of the file
  customers: number
  products: number
  invoices: number
}

export type BackupChoice = { chosen: false } | { chosen: true; summary: BackupSummary }

export type RestoreResult = { restored: true }
