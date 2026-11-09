import { Download, Upload } from 'reicon-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useBackup } from '@/hooks/use-backup'

export function BackupCard(): React.JSX.Element {
  const saveBackup = useBackup()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Save a copy of your data</CardTitle>
        <CardDescription>Bringing a copy back is coming later.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button onClick={saveBackup}>
          <Download data-icon="inline-start" />
          Save a copy
        </Button>
        <Button variant="outline" disabled>
          <Upload data-icon="inline-start" />
          Bring back a saved copy
        </Button>
      </CardContent>
    </Card>
  )
}
