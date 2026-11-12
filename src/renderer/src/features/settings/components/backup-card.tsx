import { useState } from 'react'
import { Download, Upload } from 'reicon-react'

import type { BackupSummary } from '@shared/backup/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useBackup } from '@/hooks/use-backup'
import { useChooseBackup } from '../hooks/use-restore-backup'
import { RestoreBackupDialog } from './restore-backup-dialog'

export function BackupCard(): React.JSX.Element {
  const saveBackup = useBackup()
  const chooseBackup = useChooseBackup()
  const [summary, setSummary] = useState<BackupSummary | null>(null)

  const choose = (): void => {
    chooseBackup.mutate(undefined, {
      onSuccess: (choice) => {
        if (choice.chosen) setSummary(choice.summary)
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Save a copy of your data</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button onClick={saveBackup}>
          <Download data-icon="inline-start" />
          Save a copy
        </Button>
        <Button variant="outline" disabled={chooseBackup.isPending} onClick={choose}>
          <Upload data-icon="inline-start" />
          Bring back a saved copy
        </Button>
      </CardContent>
      <RestoreBackupDialog summary={summary} onOpenChange={(open) => !open && setSummary(null)} />
    </Card>
  )
}
