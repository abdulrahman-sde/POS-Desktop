import {
  ChartBar,
  Element,
  Box,
  Cart,
  Category,
  Receipt2,
  Setting,
  Shop,
  ShoppingCart,
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
      { path: '/sales/new', label: 'New Sale', icon: ShoppingCart },
      { path: '/orders', label: 'Orders', icon: Receipt2 }
    ]
  },
  {
    label: 'Stock',
    items: [
      { path: '/stock/new', label: 'Buy Stock', icon: Cart },
      { path: '/products', label: 'Products', icon: Box },
      { path: '/categories', label: 'Categories', icon: Category }
    ]
  },
  {
    label: 'People',
    items: [
      { path: '/customers', label: 'Customers', icon: Users },
      { path: '/suppliers', label: 'Suppliers', icon: Shop }
    ]
  },
  {
    label: 'Money',
    items: [
      { path: '/payments', label: 'Payments', icon: Wallet },
      { path: '/reports', label: 'Reports', icon: ChartBar }
    ]
  }
]

export const settingsItem: NavItem = { path: '/settings', label: 'Settings', icon: Setting }

export const allNavItems: NavItem[] = [...navGroups.flatMap((group) => group.items), settingsItem]

// Used by the top bar to show the name of the page you are on.
export function findNavItem(pathname: string): NavItem | undefined {
  return allNavItems.find((item) => isNavActive(item.path, pathname))
}

// "/customers/c1" counts as being on "/customers".
// Pages that are not in the sidebar but belong to a sidebar item.
const relatedPaths: Record<string, string[]> = { '/stock/new': ['/stock/import'] }

export function isNavActive(itemPath: string, pathname: string): boolean {
  if (itemPath === '/') return pathname === '/'
  if (relatedPaths[itemPath]?.some((path) => pathname === path)) return true
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`)
}
