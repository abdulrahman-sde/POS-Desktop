import { toast } from 'sonner'

import { useApiMutation } from '@/lib/use-api'
import { backupApi } from '../api/backup.api'

// Step 1: pick a saved copy. The answer says what is inside it, or that nothing was picked.
export function useChooseBackup() {
  return useApiMutation(backupApi.choose, { onError: (error) => toast.error(error.message) })
}

// Step 2: replace everything with the picked copy. The screen then reloads to the sign-in page, which also
// clears every cached list.
export function useRestoreBackup() {
  return useApiMutation(backupApi.restore, {
    onSuccess: () => window.location.reload(),
    onError: (error) => toast.error(error.message)
  })
}
