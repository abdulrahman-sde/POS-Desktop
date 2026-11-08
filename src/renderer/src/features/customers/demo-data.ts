import { daysAgo } from '@/lib/format'
import type { Customer } from './types'

export const demoCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'Ahmed Raza (Technician)',
    phone: '03001234501',
    address: 'Hall Road, Lahore',
    notes: 'Buys screens and batteries. Pays at month end.',
    createdAt: daysAgo(120)
  },
  {
    id: 'c2',
    name: 'Fatima Mobile Zone',
    phone: '03211234502',
    address: 'Ichra Bazaar, Lahore',
    notes: '',
    createdAt: daysAgo(98)
  },
  {
    id: 'c3',
    name: 'Usman Mobile Mart',
    phone: '03331234503',
    address: 'Model Town, Lahore',
    notes: 'Deliver before noon.',
    createdAt: daysAgo(75)
  },
  {
    id: 'c4',
    name: 'Bilal Cell Care',
    phone: '03451234504',
    address: 'Samanabad, Lahore',
    notes: '',
    createdAt: daysAgo(60)
  },
  {
    id: 'c5',
    name: 'Sana Accessories',
    phone: '03011234505',
    address: 'Johar Town, Lahore',
    notes: 'Cases, glass protectors and cables only.',
    createdAt: daysAgo(44)
  },
  {
    id: 'c6',
    name: 'Hamid Ali (Repair Shop)',
    phone: '03111234506',
    address: 'Garhi Shahu, Lahore',
    notes: 'Prefers bank transfer.',
    createdAt: daysAgo(30)
  },
  {
    id: 'c7',
    name: 'City Mobile Plaza',
    phone: '03021234507',
    address: 'Gulberg III, Lahore',
    notes: 'Large monthly orders.',
    createdAt: daysAgo(21)
  },
  {
    id: 'c8',
    name: 'Zubair Brothers Telecom',
    phone: '03151234508',
    address: 'Baghbanpura, Lahore',
    notes: '',
    createdAt: daysAgo(9)
  }
]
