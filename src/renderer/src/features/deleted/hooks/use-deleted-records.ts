import { useApiQuery } from '@/lib/use-api'
import { deletedApi } from '../api/deleted.api'
import { deletedKeys } from '../api/deleted.keys'
import { EMPTY_DELETED } from '../constants'
import type { DeletedRecordsResult } from '../types'

export function useDeletedRecords(): DeletedRecordsResult {
  const query = useApiQuery(deletedKeys.all, deletedApi.list)
  return { records: query.data ?? EMPTY_DELETED, isLoading: query.isLoading }
}
