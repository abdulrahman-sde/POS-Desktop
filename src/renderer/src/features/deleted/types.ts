import type { DeletedKind, DeletedRecord, DeletedRecords } from '@shared/deleted/types'

export type { DeletedKind, DeletedRecord, DeletedRecords }

export type DeletedRecordsResult = {
  records: DeletedRecords
  isLoading: boolean
}

export type DeletedTab = {
  value: keyof DeletedRecords
  label: string
  kind: DeletedKind
  empty: string
}

export type RestoreVariables = {
  kind: DeletedKind
  id: string
  name: string
}

export type DeletedTableProps = {
  records: DeletedRecord[]
  kind: DeletedKind
  empty: string
}
