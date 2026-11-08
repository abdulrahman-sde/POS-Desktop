import { useState } from 'react'

import { PageHeader } from '@/components/shared/page-header'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DeletedTable } from '@/features/deleted/components/deleted-table'
import { deletedTabs } from '@/features/deleted/constants'
import { useDeletedRecords } from '@/features/deleted/hooks/use-deleted-records'

export function DeletedPage(): React.JSX.Element {
  const { records } = useDeletedRecords()
  const [tab, setTab] = useState(deletedTabs[0].value)
  const current = deletedTabs.find((item) => item.value === tab) ?? deletedTabs[0]

  return (
    <>
      <PageHeader
        title="Deleted records"
        description="Nothing is ever really deleted. Bring a product, customer, supplier or category back here."
      />

      <div className="mb-3">
        <Tabs value={tab} onValueChange={(value) => setTab(value as typeof tab)}>
          <TabsList>
            {deletedTabs.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
                {records[item.value].length > 0 ? ` (${records[item.value].length})` : ''}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <DeletedTable records={records[current.value]} kind={current.kind} empty={current.empty} />
    </>
  )
}
