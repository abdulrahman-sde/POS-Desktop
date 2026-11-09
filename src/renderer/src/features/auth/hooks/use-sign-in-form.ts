import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useApiMutation } from '@/lib/use-api'
import { authApi } from '../api/auth.api'
import { authKeys } from '../api/auth.keys'
import type { SignInFormResult } from '../types'

export function useSignInForm(): SignInFormResult {
  const queryClient = useQueryClient()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const unlock = useApiMutation(authApi.unlock, {
    onSuccess: (status) => queryClient.setQueryData(authKeys.status, status),
    onError: (e) => {
      setError(e.message)
      setPassword('')
    }
  })

  const submit = (event: React.FormEvent): void => {
    event.preventDefault()
    if (unlock.isPending) return
    setError('')
    unlock.mutate({ password })
  }

  return { password, setPassword, error, isSigningIn: unlock.isPending, submit }
}
