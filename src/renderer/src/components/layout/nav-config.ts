import {
  ChartBar,
  Element,
  Box,
  Receipt,
  Setting,
  ShoppingCart,
  Truck,
  Users,
  Wallet,
  type IconComponent
} from 'reicon-react'

export type NavItem = {
  path: string
  label: string
  icon: IconComponent
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    label: 'Sales',
    items: [
      { path: '/', label: 'Dashboard', icon: Element },
      { path: '/sales/new', label: 'New Sale', icon: ShoppingCart }
    ]
  },
  {
    label: 'Inventory',
    items: [
      { path: '/products', label: 'Products', icon: Box },
      { path: '/suppliers', label: 'Suppliers', icon: Truck }
    ]
  },
  {
    label: 'People',
    items: [{ path: '/customers', label: 'Customers', icon: Users }]
  },
  {
    label: 'Finance',
    items: [
      { path: '/payments', label: 'Payments', icon: Wallet },
      { path: '/expenses', label: 'Expenses', icon: Receipt },
      { path: '/reports', label: 'Reports', icon: ChartBar }
    ]
  }
]

export const settingsItem: NavItem = { path: '/settings', label: 'Settings', icon: Setting }

export const allNavItems: NavItem[] = [...navGroups.flatMap((group) => group.items), settingsItem]

// Used by the top bar to show the name of the page you are on.
export function findNavItem(pathname: string): NavItem | undefined {
  return allNavItems.find((item) => item.path === pathname)
}
