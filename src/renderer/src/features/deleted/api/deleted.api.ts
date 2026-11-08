import type { RestoreInput } from '@shared/deleted/types'

export const deletedApi = {
  list: () => window.api.deleted.list(),
  restore: (input: RestoreInput) => window.api.deleted.restore(input)
}
