import { DocumentUpload } from 'reicon-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useImportStarterData, useStarterStatus } from '../hooks/use-starter-data'

export function StarterDataCard(): React.JSX.Element | null {
  const status = useStarterStatus()
  const importData = useImportStarterData()
  const imported = status.data?.imported ?? true // hidden-looking until we know

  return (
    <Card>
      <CardHeader>
        <CardTitle>Starting data</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          disabled={imported || importData.isPending}
          onClick={() => importData.mutate()}
        >
          <DocumentUpload data-icon="inline-start" />
          {imported ? 'Starting data imported' : 'Import starting data'}
        </Button>
      </CardContent>
    </Card>
  )
}
