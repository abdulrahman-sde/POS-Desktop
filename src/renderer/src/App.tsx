import { RouterProvider } from 'react-router'

import { DataProvider } from '@/app/providers/data-provider'
import { PurchaseDraftProvider } from '@/app/providers/purchase-draft-provider'
import { InvoiceViewerProvider } from '@/app/providers/invoice-viewer-provider'
import { router } from '@/app/router'
import { Toaster } from '@/components/ui/sonner'

function App(): React.JSX.Element {
  return (
    <DataProvider>
      <PurchaseDraftProvider>
        <InvoiceViewerProvider>
          <RouterProvider router={router} />
        </InvoiceViewerProvider>
      </PurchaseDraftProvider>
      <Toaster position="bottom-right" />
    </DataProvider>
  )
}

export default App
