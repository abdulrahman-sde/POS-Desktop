export const deletedKinds = ['product', 'customer', 'supplier', 'category'] as const
export type DeletedKind = (typeof deletedKinds)[number]
