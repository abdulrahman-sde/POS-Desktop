import { app } from 'electron'
import { isSameDay } from 'date-fns'
import { existsSync, mkdirSync, renameSync, rmSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { backupDatabase, isDatabaseHealthy } from '../db/connection'

// An automatic copy of the data, once a day, in Documents\Stockwise Backups. Two files with fixed names, so it never
// grows: the newest, and the one before it. A copy is only made when the database passes SQLite's own check, so a
// damaged database can never replace a good copy.
const NEWEST = 'stockwise-auto-backup.db'
const PREVIOUS = 'stockwise-auto-backup-previous.db'
const TEMP = 'stockwise-auto-backup.tmp'
const CHECK_EVERY_MS = 60 * 60 * 1000

export type AutoBackupOutcome = 'saved' | 'already-today' | 'database-not-healthy'

export async function autoBackupOnce(folder: string, now = new Date()): Promise<AutoBackupOutcome> {
  const newest = join(folder, NEWEST)
  if (existsSync(newest) && isSameDay(statSync(newest).mtime, now)) return 'already-today'
  if (!isDatabaseHealthy()) return 'database-not-healthy'

  mkdirSync(folder, { recursive: true })
  const temp = join(folder, TEMP)
  rmSync(temp, { force: true })
  await backupDatabase(temp)
  // Only now is the old newest copy moved aside, so a failed copy never costs a good one.
  if (existsSync(newest)) renameSync(newest, join(folder, PREVIOUS))
  renameSync(temp, newest)
  return 'saved'
}

let running = false

// Runs when the app opens, then checks every hour in case the app stays open past midnight.
export function startAutoBackup(): void {
  const folder = join(app.getPath('documents'), 'Stockwise Backups')
  const run = (): void => {
    if (running) return
    running = true
    autoBackupOnce(folder)
      .catch((error) => console.error('[auto-backup]', error))
      .finally(() => {
        running = false
      })
  }
  run()
  setInterval(run, CHECK_EVERY_MS).unref()
}
