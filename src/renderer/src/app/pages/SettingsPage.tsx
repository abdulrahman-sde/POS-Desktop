import { PageHeader } from '@/components/shared/page-header'
import { ChangePasswordCard } from '@/features/auth/components/change-password-card'
import { BackupCard } from '@/features/settings/components/backup-card'
import { DeletedRecordsCard } from '@/features/settings/components/deleted-records-card'
import { ShopSettingsForm } from '@/features/settings/components/shop-settings-form'

export function SettingsPage(): React.JSX.Element {
  return (
    <>
      <PageHeader title="Settings" />
      <div className="flex max-w-3xl flex-col gap-4">
        <ShopSettingsForm />
        <ChangePasswordCard />
        <BackupCard />
        <DeletedRecordsCard />
      </div>
    </>
  )
}
