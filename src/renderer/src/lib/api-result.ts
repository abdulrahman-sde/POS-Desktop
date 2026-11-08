import type { ApiResult } from '@shared/result'

// The one place that checks a backend answer. A failed answer becomes a normal Error whose message
// is the plain sentence from the backend ("You already have a product with this name."), so React
// Query treats it as a failure instead of a success that happens to hold an error.
export function unwrap<T>(result: ApiResult<T>): T {
  if (!result.ok) throw new Error(result.message)
  return result.data
}
