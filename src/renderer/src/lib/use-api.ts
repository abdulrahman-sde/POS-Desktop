import {
  useMutation,
  useQuery,
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions
} from '@tanstack/react-query'

import type { ApiResult } from '@shared/result'
import { unwrap } from './api-result'

// Use these two instead of useQuery / useMutation for backend calls. They run unwrap() for you,
// so a hook can never forget to check the answer.

// READ: pass the query key and the api function. `data` is the unwrapped value.
export function useApiQuery<T>(
  queryKey: QueryKey,
  fetcher: () => Promise<ApiResult<T>>,
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, Error>({ ...options, queryKey, queryFn: async () => unwrap(await fetcher()) })
}

// WRITE: pass the api function. Error messages are plain sentences; show them where the owner is
// looking (inline under a form field, or a toast). Success toasts and refreshing data live in the hook.
export function useApiMutation<Data, Variables>(
  send: (variables: Variables) => Promise<ApiResult<Data>>,
  options?: Omit<UseMutationOptions<Data, Error, Variables>, 'mutationFn'>
) {
  return useMutation<Data, Error, Variables>({
    ...options,
    mutationFn: async (variables) => unwrap(await send(variables))
  })
}
