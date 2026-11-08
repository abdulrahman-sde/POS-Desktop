import { toast } from 'sonner'

import { useApiMutation } from '@/lib/use-api'
import { backupApi } from '../api/backup.api'

export function useCreateBackup() {
  return useApiMutation(backupApi.create, {
    onSuccess: (result) => {
      if (result.saved) toast.success('Copy of your data saved')
    },
    onError: (error) => toast.error(error.message)
  })
}
