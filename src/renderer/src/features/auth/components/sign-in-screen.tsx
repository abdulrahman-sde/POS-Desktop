import { Logo } from '@/components/layout/logo'
import { FormField } from '@/components/shared/form-field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/shared/password-input'
import { useSignInForm } from '../hooks/use-sign-in-form'
import type { SignInScreenProps } from '../types'

export function SignInScreen({ shopName }: SignInScreenProps): React.JSX.Element {
  const form = useSignInForm()

  return (
    <div className="flex min-h-svh items-center justify-center bg-sidebar p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <Logo className="size-12" />
          <CardTitle className="text-xl">Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.submit} className="flex flex-col gap-4">
            <FormField label="Shop name" htmlFor="shop-name">
              <Input id="shop-name" value={shopName} readOnly disabled />
            </FormField>
            <FormField label="Password" htmlFor="password" error={form.error}>
              <PasswordInput
                id="password"
                autoFocus
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => form.setPassword(e.target.value)}
                aria-invalid={form.error ? true : undefined}
              />
            </FormField>
            <Button type="submit" disabled={form.isSigningIn || form.password === ''}>
              {form.isSigningIn ? 'Checking...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
