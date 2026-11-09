import { useAuthStatus } from '../hooks/use-auth-status'
import type { AuthGateProps } from '../types'
import { SignInScreen } from './sign-in-screen'

// Nothing inside the gate (and none of its data) loads until the password is right.
export function AuthGate({ children }: AuthGateProps): React.JSX.Element | null {
  const { data } = useAuthStatus()
  if (!data) return null
  if (!data.unlocked) return <SignInScreen shopName={data.shopName} />
  return <>{children}</>
}
