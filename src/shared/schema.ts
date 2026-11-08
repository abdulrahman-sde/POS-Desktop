// Every database table in one place. The main process hands this to Drizzle so it knows the
// tables. When you add a feature, export its table here.
export * from './categories/table'
export * from './customers/table'
export * from './payments/table'
export * from './products/table'
export * from './purchases/table'
export * from './sales/table'
export * from './settings/table'
export * from './suppliers/table'
