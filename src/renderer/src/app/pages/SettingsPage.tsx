import { PageHeader } from '@/components/shared/page-header'
import { BackupCard } from '@/features/settings/components/backup-card'
import { ShopSettingsForm } from '@/features/settings/components/shop-settings-form'

export function SettingsPage(): React.JSX.Element {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Your shop details and saving a copy of your data."
      />
      <div className="flex max-w-3xl flex-col gap-4">
        <ShopSettingsForm />
        <BackupCard />
      </div>
    </>
  )
}
