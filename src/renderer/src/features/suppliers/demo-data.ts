import { daysAgo } from '@/lib/format'
import type { Supplier } from './types'

// The shop has one main supplier for now. More can be added on the Suppliers screen.
export const demoSuppliers: Supplier[] = [
  {
    id: 's1',
    name: 'Hall Road Mobile Parts Wholesale',
    phone: '03001234599',
    address: 'Hall Road, Lahore',
    notes: 'Main supplier. Screens, batteries and chargers.',
    createdAt: daysAgo(300)
  }
]
