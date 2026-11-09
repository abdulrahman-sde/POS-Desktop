import { Trash } from 'reicon-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DeletedRecordsCard(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deleted records</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="outline" nativeButton={false} render={<Link to="/deleted" />}>
          <Trash data-icon="inline-start" />
          View deleted records
        </Button>
      </CardContent>
    </Card>
  )
}
