import { Refresh } from 'reicon-react'

import { Button } from '@/components/ui/button'
import { useInstallUpdate, useUpdateStatus } from '../hooks/use-update'

// Top bar. Only there when a new version has been downloaded.
export function UpdateButton(): React.JSX.Element | null {
  const { readyVersion } = useUpdateStatus()
  const install = useInstallUpdate()
  if (!readyVersion) return null

  return (
    <Button size="sm" disabled={install.isPending} onClick={() => install.mutate()}>
      <Refresh data-icon="inline-start" />
      <span className="hidden sm:inline">Restart to update to {readyVersion}</span>
      <span className="sm:hidden">Update</span>
    </Button>
  )
}
