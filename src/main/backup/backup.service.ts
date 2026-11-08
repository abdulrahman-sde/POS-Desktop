import { backupDatabase } from '../db/connection'

export async function createBackup(destination: string): Promise<void> {
  await backupDatabase(destination)
}
