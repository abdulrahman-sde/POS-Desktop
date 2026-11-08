export const purchaseKeys = {
  all: ['purchases'] as const,
  list: () => [...purchaseKeys.all, 'list'] as const
}

export const supplierPaymentKeys = {
  all: ['supplier-payments'] as const,
  list: () => [...supplierPaymentKeys.all, 'list'] as const
}
