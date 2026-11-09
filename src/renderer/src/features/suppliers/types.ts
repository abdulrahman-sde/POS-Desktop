import type { Supplier } from '@shared/suppliers/types'
import type { PaymentMethod } from '@/features/sales/types'

export type { Supplier }

export type SuppliersResult = {
  suppliers: Supplier[]
  allSuppliers: Supplier[]
  isLoading: boolean
}

export type SupplierRow = {
  supplier: Supplier
  billCount: number
  owed: number
}

export type SupplierFormFields = {
  name: string
  phone: string
  address: string
  notes: string
  openingBalance: string
}

export type SupplierFormErrors = Record<string, string>

export type SupplierFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier?: Supplier
  onSaved?: (supplier: Supplier) => void
}

export type SupplierFormProps = {
  supplier?: Supplier
  onSaved?: (supplier: Supplier) => void
  onDone: () => void
}

export type SupplierDeleteDialogProps = {
  supplier: Supplier
  open: boolean
  onOpenChange: (open: boolean) => void
}

export type PaySupplierFormFields = {
  amount: string
  method: PaymentMethod
}

export type PaySupplierDialogProps = {
  supplier: Supplier | null
  owed: number
  onOpenChange: (open: boolean) => void
}

export type PaySupplierFormProps = {
  supplier: Supplier
  owed: number
  onDone: () => void
}
