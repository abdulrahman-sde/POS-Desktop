import { useApiQuery } from '@/lib/use-api'
import { authApi } from '../api/auth.api'
import { authKeys } from '../api/auth.keys'

export function useAuthStatus() {
  return useApiQuery(authKeys.status, authApi.status)
}
