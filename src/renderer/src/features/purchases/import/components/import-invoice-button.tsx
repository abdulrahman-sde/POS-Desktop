import { useRef } from 'react'
import { DocumentUpload } from 'reicon-react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'

import { usePurchaseDraft } from '@/app/providers/purchase-draft-context'
import { Button } from '@/components/ui/button'

// "Import invoice" on Buy Stock: choose the supplier's PDF and the review page opens.
// While an invoice is still being checked, the button takes you back to it instead.
export function ImportInvoiceButton(): React.JSX.Element {
  const { importer } = usePurchaseDraft()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const onFile = (file: File | undefined): void => {
    if (inputRef.current) inputRef.current.value = '' // so the same file can be chosen again
    if (!file) return
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please choose a PDF file.')
      return
    }
    void importer.start(file)
    navigate('/stock/import')
  }

  if (importer.session) {
    return (
      <Button variant="outline" nativeButton={false} render={<Link to="/stock/import" />}>
        <DocumentUpload data-icon="inline-start" />
        Continue invoice
      </Button>
    )
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(event) => onFile(event.target.files?.[0])}
      />
      <Button variant="outline" onClick={() => inputRef.current?.click()}>
        <DocumentUpload data-icon="inline-start" />
        Import invoice
      </Button>
    </>
  )
}
