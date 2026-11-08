import { useState } from 'react'
import { DocumentText } from 'reicon-react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'

import { usePurchaseDraft } from '@/app/providers/purchase-draft-context'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ImportReview } from '@/features/purchases/import/components/import-review'
import { PdfPanel } from '@/features/purchases/import/components/pdf-panel'
import { plural } from '@/lib/format'

// Importing a supplier's invoice. A full page, not a pop-up: the invoice is on the left to read, the items are on the
// right to check and fix. Everything is kept if you leave the page and come back.
export function ImportInvoicePage(): React.JSX.Element {
  const { cart, importer } = usePurchaseDraft()
  const navigate = useNavigate()
  const [showInvoice, setShowInvoice] = useState(true)
  const { session } = importer

  if (!session) {
    return (
      <EmptyState
        icon={DocumentText}
        title="No invoice"
        description="Use Import invoice on the Buy stock page."
        action={
          <Button nativeButton={false} render={<Link to="/stock/new" />}>
            Go to Buy stock
          </Button>
        }
      />
    )
  }

  const addToBill = async (): Promise<void> => {
    try {
      const entries = await importer.commit()
      cart.addLines(entries)
      importer.clear()
      toast.success(`${plural(entries.length, 'item')} added to your bill`)
      navigate('/stock/new')
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  const discard = (): void => {
    importer.clear()
    navigate('/stock/new')
  }

  return (
    <div className="flex flex-col lg:h-full">
      <PageHeader
        title="Import invoice"
        description={session.file.name}
        actions={
          <Button variant="outline" onClick={() => setShowInvoice((value) => !value)}>
            {showInvoice ? 'Hide invoice' : 'Show invoice'}
          </Button>
        }
      />
      <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
        {showInvoice ? (
          <Card className="flex h-96 min-h-0 min-w-0 gap-0 overflow-hidden py-0 lg:h-auto lg:w-2/5">
            <PdfPanel
              key={`${session.file.name}-${session.file.size}-${session.file.lastModified}`}
              file={session.file}
            />
          </Card>
        ) : null}
        <Card className="flex min-h-0 min-w-0 flex-1 gap-0 py-0">
          <ImportReview importer={importer} onAddToBill={addToBill} onDiscard={discard} />
        </Card>
      </div>
    </div>
  )
}
