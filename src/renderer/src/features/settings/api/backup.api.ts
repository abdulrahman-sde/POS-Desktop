export const backupApi = {
  create: () => window.api.backup.create(),
  choose: () => window.api.backup.choose(),
  restore: () => window.api.backup.restore()
}
