import { createHashRouter } from 'react-router'

import { AppLayout } from '@/components/layout/app-layout'
import { CustomerDetailPage } from '@/app/pages/CustomerDetailPage'
import { BuyStockPage } from '@/app/pages/BuyStockPage'
import { ImportInvoicePage } from '@/app/pages/ImportInvoicePage'
import { OrdersPage } from '@/app/pages/OrdersPage'
import { CategoriesPage } from '@/app/pages/CategoriesPage'
import { CustomersPage } from '@/app/pages/CustomersPage'
import { DeletedPage } from '@/app/pages/DeletedPage'
import { DashboardPage } from '@/app/pages/DashboardPage'
import { PaymentsPage } from '@/app/pages/PaymentsPage'
import { ProductsPage } from '@/app/pages/ProductsPage'
import { ReportsPage } from '@/app/pages/ReportsPage'
import { NewSalePage } from '@/app/pages/NewSalePage'
import { SuppliersPage } from '@/app/pages/SuppliersPage'
import { SettingsPage } from '@/app/pages/SettingsPage'

// Hash router: URLs look like index.html#/products. Electron loads the app from a
// file on disk (no web server), so normal URLs like /products would not work.
export const router = createHashRouter([
  {
    // The layout route: sidebar + top bar. Its <Outlet /> shows the matched child page.
    element: <AppLayout />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/sales/new', element: <NewSalePage /> },
      { path: '/orders', element: <OrdersPage /> },
      { path: '/categories', element: <CategoriesPage /> },
      { path: '/stock/new', element: <BuyStockPage /> },
      { path: '/stock/import', element: <ImportInvoicePage /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/customers', element: <CustomersPage /> },
      { path: '/customers/:id', element: <CustomerDetailPage /> },
      { path: '/suppliers', element: <SuppliersPage /> },
      { path: '/payments', element: <PaymentsPage /> },
      { path: '/reports', element: <ReportsPage /> },
      { path: '/settings', element: <SettingsPage /> },
      { path: '/deleted', element: <DeletedPage /> }
    ]
  }
])
