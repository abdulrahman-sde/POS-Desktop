import { createHashRouter } from 'react-router'

import { AppLayout } from '@/components/layout/app-layout'
import { CustomersPage } from '@/app/pages/CustomersPage'
import { DashboardPage } from '@/app/pages/DashboardPage'
import { ExpensesPage } from '@/app/pages/ExpensesPage'
import { PaymentsPage } from '@/app/pages/PaymentsPage'
import { ProductsPage } from '@/app/pages/ProductsPage'
import { ReportsPage } from '@/app/pages/ReportsPage'
import { NewSalePage } from '@/app/pages/NewSalePage'
import { SettingsPage } from '@/app/pages/SettingsPage'
import { SuppliersPage } from '@/app/pages/SuppliersPage'

// Hash router: URLs look like index.html#/products. Electron loads the app from a
// file on disk (no web server), so normal URLs like /products would not work.
export const router = createHashRouter([
  {
    // The layout route: sidebar + top bar. Its <Outlet /> shows the matched child page.
    element: <AppLayout />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/sales/new', element: <NewSalePage /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/suppliers', element: <SuppliersPage /> },
      { path: '/customers', element: <CustomersPage /> },
      { path: '/payments', element: <PaymentsPage /> },
      { path: '/expenses', element: <ExpensesPage /> },
      { path: '/reports', element: <ReportsPage /> },
      { path: '/settings', element: <SettingsPage /> }
    ]
  }
])
