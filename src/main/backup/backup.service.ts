import Database from 'better-sqlite3'
import { copyFileSync, existsSync, readFileSync, renameSync, rmSync, statSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'

import type { BackupSummary } from '@shared/backup/types'
import { backupDatabase, closeDb, getDbFile, getMigrationsFolder, initDb } from '../db/connection'
import { UserError } from '../lib/ipc'
import { setUnlocked } from '../lib/session'

// A copy made by this app always has these tables.
const REQUIRED_TABLES = ['products', 'customers', 'orders', 'categories', '__drizzle_migrations']
const NOT_A_COPY = 'That file is not a copy saved by Stockwise.'

// The chosen copy waits here (inside the data folder, on the same disk) until the owner confirms.
const incomingFile = (): string => join(dirname(getDbFile()), 'restore-incoming.db')
// What was in the app before the last restore. Only the latest one is kept.
const safetyFile = (): string => join(dirname(getDbFile()), 'before-restore.db')
let prepared = false

const removeSideFiles = (file: string): void => {
  rmSync(`${file}-wal`, { force: true })
  rmSync(`${file}-shm`, { force: true })
}

export async function createBackup(destination: string): Promise<void> {
  await backupDatabase(destination)
}

const count = (database: Database.Database, table: string): number => {
  try {
    return (
      database.prepare(`select count(*) as n from ${table} where deleted_at is null`).get() as {
        n: number
      }
    ).n
  } catch {
    return (database.prepare(`select count(*) as n from ${table}`).get() as { n: number }).n
  }
}

// Copies the picked file next to the real database and checks it. Nothing in the app changes yet.
export function prepareRestore(source: string): BackupSummary {
  prepared = false
  const target = incomingFile()
  removeSideFiles(target)
  copyFileSync(source, target)

  let copy: Database.Database | null = null
  try {
    copy = new Database(target, { fileMustExist: true })
    const tables = new Set(
      (
        copy.prepare("select name from sqlite_master where type = 'table'").all() as {
          name: string
        }[]
      ).map((row) => row.name)
    )
    if (!REQUIRED_TABLES.every((name) => tables.has(name))) throw new UserError(NOT_A_COPY)
    if (copy.pragma('integrity_check', { simple: true }) !== 'ok') {
      throw new UserError('That copy is damaged and cannot be used.')
    }

    const applied = (
      copy.prepare('select count(*) as n from __drizzle_migrations').get() as { n: number }
    ).n
    const journal = JSON.parse(
      readFileSync(join(getMigrationsFolder(), 'meta', '_journal.json'), 'utf8')
    ) as { entries: unknown[] }
    if (applied > journal.entries.length) {
      throw new UserError(
        'That copy was saved by a newer version of Stockwise. Update the app first.'
      )
    }

    const summary: BackupSummary = {
      fileName: basename(source),
      savedAt: statSync(source).mtime.toISOString(),
      customers: count(copy, 'customers'),
      products: count(copy, 'products'),
      invoices: count(copy, 'orders')
    }
    prepared = true
    return summary
  } catch (error) {
    if (error instanceof UserError) throw error
    console.error('[backup:choose]', error)
    throw new UserError(NOT_A_COPY)
  } finally {
    copy?.close()
    if (!prepared) {
      rmSync(target, { force: true })
      removeSideFiles(target)
    }
  }
}

// Replaces everything in the app with the copy picked in prepareRestore. The app's own data is saved to
// before-restore.db first, and put back if the copy cannot be opened.
export async function restoreChosen(): Promise<void> {
  const incoming = incomingFile()
  if (!prepared || !existsSync(incoming)) throw new UserError('Choose a saved copy first.')
  prepared = false

  const file = getDbFile()
  const safety = safetyFile()
  removeSideFiles(safety)
  await backupDatabase(safety)

  closeDb()
  removeSideFiles(file)
  removeSideFiles(incoming)
  try {
    renameSync(incoming, file)
    initDb(file, getMigrationsFolder())
  } catch (error) {
    console.error('[backup:restore]', error)
    closeDb()
    removeSideFiles(file)
    copyFileSync(safety, file)
    initDb(file, getMigrationsFolder())
    throw new UserError('We could not use that copy. Your data has not been changed.')
  }
  // The copy has its own password, so sign in again with it.
  setUnlocked(false)
}
