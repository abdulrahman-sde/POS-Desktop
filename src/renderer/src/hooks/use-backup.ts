import { useCreateBackup } from '@/features/settings/hooks/use-create-backup'

export function useBackup(): () => void {
  const createBackup = useCreateBackup()
  return () => {
    if (!createBackup.isPending) createBackup.mutate()
  }
}
