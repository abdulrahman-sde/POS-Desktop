import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'

import { DataProvider } from '@/app/providers/data-provider'
import { PurchaseDraftProvider } from '@/app/providers/purchase-draft-provider'
import { InvoiceViewerProvider } from '@/app/providers/invoice-viewer-provider'
import { router } from '@/app/router'
import { Toaster } from '@/components/ui/sonner'
import { queryClient } from '@/lib/query-client'

function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <PurchaseDraftProvider>
          <InvoiceViewerProvider>
            <RouterProvider router={router} />
          </InvoiceViewerProvider>
        </PurchaseDraftProvider>
        <Toaster position="bottom-right" />
      </DataProvider>
    </QueryClientProvider>
  )
}

export default App
