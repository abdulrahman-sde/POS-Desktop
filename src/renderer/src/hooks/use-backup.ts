import { toast } from 'sonner'

import { useData } from '@/app/providers/data-context'
import { useCustomers } from '@/features/customers/hooks/use-customers'
import { useCategories } from '@/features/categories/hooks/use-categories'
import { useProducts } from '@/features/products/hooks/use-products'
import { toDateInput } from '@/lib/format'

// Saves a copy of all shop data as one file. Used by the top bar button and the Settings page.
// (While the app runs on demo data this is a JSON download; later it will copy the real database.)
export function useBackup(): () => void {
  const { products } = useProducts()
  const { categories } = useCategories()
  const { orders, payments, settings } = useData()
  const { customers } = useCustomers()

  return () => {
    const data = JSON.stringify(
      { products, categories, customers, orders, payments, settings },
      null,
      2
    )
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }))
    link.download = `babar-trades-backup-${toDateInput()}.json`
    link.click()
    URL.revokeObjectURL(link.href)
    toast.success('Copy of your data saved')
  }
}
