export type AuthGateProps = {
  children: React.ReactNode
}

export type SignInScreenProps = {
  shopName: string
}

export type SignInFormResult = {
  password: string
  setPassword: (value: string) => void
  error: string
  isSigningIn: boolean
  submit: (event: React.FormEvent) => void
}

export type ChangePasswordFields = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export type ChangePasswordErrors = Partial<Record<keyof ChangePasswordFields, string>>

export type ChangePasswordFormResult = {
  form: ChangePasswordFields
  errors: ChangePasswordErrors
  saving: boolean
  set: (field: keyof ChangePasswordFields) => (event: React.ChangeEvent<HTMLInputElement>) => void
  submit: (event: React.FormEvent) => void
}
