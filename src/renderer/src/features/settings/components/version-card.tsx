import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUpdateStatus } from '../hooks/use-update'

export function VersionCard(): React.JSX.Element {
  const { version } = useUpdateStatus()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stockwise version {version}</CardTitle>
      </CardHeader>
      <CardContent />
    </Card>
  )
}
