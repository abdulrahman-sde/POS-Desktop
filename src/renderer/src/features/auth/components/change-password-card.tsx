import { FormField } from '@/components/shared/form-field'
import { PasswordInput } from '@/components/shared/password-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useChangePasswordForm } from '../hooks/use-change-password-form'

export function ChangePasswordCard(): React.JSX.Element {
  const { form, errors, saving, set, submit } = useChangePasswordForm()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>
          This is the password you type every time you open the app. Write the new one down
          somewhere safe: if it is forgotten, the app cannot be opened.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="flex flex-col gap-3 sm:max-w-sm">
          <FormField label="Current password" htmlFor="pw-current" error={errors.currentPassword}>
            <PasswordInput
              id="pw-current"
              autoComplete="current-password"
              value={form.currentPassword}
              onChange={set('currentPassword')}
            />
          </FormField>
          <FormField
            label="New password"
            htmlFor="pw-new"
            error={errors.newPassword}
            hint="At least 6 letters or numbers."
          >
            <PasswordInput
              id="pw-new"
              autoComplete="new-password"
              value={form.newPassword}
              onChange={set('newPassword')}
            />
          </FormField>
          <FormField
            label="Type the new password again"
            htmlFor="pw-confirm"
            error={errors.confirmPassword}
          >
            <PasswordInput
              id="pw-confirm"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
            />
          </FormField>
          <div>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Change password'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
