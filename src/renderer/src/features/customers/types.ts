import type { Customer } from '@shared/customers/types'

export type { Customer }

export type CustomersResult = {
  customers: Customer[]
  allCustomers: Customer[]
  isLoading: boolean
}

export type CustomerRow = {
  customer: Customer
  balance: number
  orderCount: number
  lastOrderAt: string | null
}

export type CustomerFormFields = {
  name: string
  phone: string
  address: string
  notes: string
  openingBalance: string
}

export type CustomerFormErrors = Record<string, string>

export type CustomerFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer?: Customer
  onSaved?: (customer: Customer) => void
}

export type CustomerFormProps = {
  customer?: Customer
  onSaved?: (customer: Customer) => void
  onDone: () => void
}

export type CustomerDeleteDialogProps = {
  customer: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted: () => void
}
