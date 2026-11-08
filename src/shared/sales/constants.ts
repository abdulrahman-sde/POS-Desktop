export const paymentMethods = ['cash', 'bank', 'wallet'] as const
export type PaymentMethod = (typeof paymentMethods)[number]

export const FIRST_INVOICE_NUMBER = 1001
