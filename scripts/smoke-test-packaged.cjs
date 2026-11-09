// Usage: <packaged app's exe> (with ELECTRON_RUN_AS_NODE=1) scripts/smoke-test-packaged.cjs <unpacked folder> <result file>
// Opens the database engine that is inside the packaged app, runs every migration on a throwaway
// database, and checks the tables the app needs. Exits with an error if anything is wrong.
const fs = require('fs')
const os = require('os')
const path = require('path')
const { createRequire } = require('module')

const [unpackedArg, resultFile] = process.argv.slice(2)
const resources = path.join(path.resolve(unpackedArg), 'resources')
const lines = []
const log = (text) => lines.push(text)
const finish = (ok) => {
  if (resultFile) fs.writeFileSync(resultFile, lines.join('\n') + '\n')
  console.log(lines.join('\n'))
  process.exit(ok ? 0 : 1)
}

try {
  // The packaged app keeps its code in app.asar; load modules the way the app does.
  const asar = path.join(resources, 'app.asar')
  const appPackage = fs.existsSync(asar)
    ? path.join(asar, 'package.json')
    : path.join(resources, 'app', 'package.json')
  const appRequire = createRequire(appPackage)
  const Database = appRequire('better-sqlite3')
  const { drizzle } = appRequire('drizzle-orm/better-sqlite3')
  const { migrate } = appRequire('drizzle-orm/better-sqlite3/migrator')
  log('database engine loaded')

  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'stockwise-smoke-'))
  const sqlite = new Database(path.join(folder, 'smoke.db'))
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')

  const migrations = path.join(resources, 'migrations')
  if (!fs.existsSync(migrations))
    throw new Error('migrations folder is missing from the package: ' + migrations)
  migrate(drizzle(sqlite), { migrationsFolder: migrations })
  const applied = sqlite.prepare('select count(*) as n from __drizzle_migrations').get().n
  const files = fs.readdirSync(migrations).filter((f) => f.endsWith('.sql')).length
  if (applied !== files)
    throw new Error(`applied ${applied} migrations but the package has ${files}`)
  log(`${applied} migrations applied`)

  const need = [
    'customers',
    'suppliers',
    'products',
    'categories',
    'orders',
    'order_items',
    'purchases',
    'purchase_items',
    'payments',
    'supplier_payments',
    'settings',
    'auth'
  ]
  const have = new Set(
    sqlite
      .prepare("select name from sqlite_master where type='table'")
      .all()
      .map((r) => r.name)
  )
  const missing = need.filter((t) => !have.has(t))
  if (missing.length) throw new Error('missing tables: ' + missing.join(', '))
  for (const t of ['customers', 'suppliers']) {
    if (
      !sqlite
        .prepare(`pragma table_info(${t})`)
        .all()
        .some((c) => c.name === 'opening_balance')
    )
      throw new Error(`${t}.opening_balance is missing`)
  }
  sqlite
    .prepare(
      "insert into customers (id,name,phone,address,notes,created_at) values ('t','Test','','','','2026-01-01')"
    )
    .run()
  if (sqlite.prepare('select count(*) as n from customers').get().n !== 1)
    throw new Error('could not write to the database')
  sqlite.close()
  log('tables present, write and read work')
  log('SMOKE TEST PASSED')
  finish(true)
} catch (error) {
  log('SMOKE TEST FAILED: ' + (error && error.stack ? error.stack : error))
  finish(false)
}
