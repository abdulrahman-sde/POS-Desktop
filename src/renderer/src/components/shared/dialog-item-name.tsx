import type { DialogItemNameProps } from './types'

export function DialogItemName({ name }: DialogItemNameProps): React.JSX.Element {
  return <p className="rounded-lg bg-muted px-3 py-2 text-sm break-words">{name}</p>
}
