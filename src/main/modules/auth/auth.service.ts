import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'

import type { AuthStatus, ChangePasswordInput, UnlockInput } from '@shared/auth/types'
import { getDb } from '../../db/connection'
import { UserError } from '../../lib/ipc'
import { setUnlocked, isUnlocked } from '../../lib/session'
import { readSettings } from '../settings/settings.service'
import * as q from './auth.queries'

const KEY_LENGTH = 32

// The password the app starts with, until the owner changes it in Settings (salted hash only).
const STARTING = {
  salt: '61da8aa6e0937afdc9a6f1f47eda1d2a',
  hash: 'b71aa2ffeb837b659d01cd4fb334e95d29815ed333df5f9cf91eaaf0acf065f9'
}

const hashPassword = (password: string, salt: string): string =>
  scryptSync(password, Buffer.from(salt, 'hex'), KEY_LENGTH).toString('hex')

function matches(password: string): boolean {
  const saved = q.findAuth(getDb()) ?? STARTING
  return timingSafeEqual(
    Buffer.from(hashPassword(password, saved.salt), 'hex'),
    Buffer.from(saved.hash, 'hex')
  )
}

export function getStatus(): AuthStatus {
  return { unlocked: isUnlocked(), shopName: readSettings(getDb()).shopName }
}

export async function unlock({ password }: UnlockInput): Promise<AuthStatus> {
  if (!matches(password)) {
    // A short wait makes guessing many passwords slow.
    await new Promise((resolve) => setTimeout(resolve, 800))
    throw new UserError('That password is not right. Please try again.')
  }
  setUnlocked(true)
  return getStatus()
}

export async function changePassword(input: ChangePasswordInput): Promise<null> {
  if (!matches(input.currentPassword)) {
    await new Promise((resolve) => setTimeout(resolve, 800))
    throw new UserError('Your current password is not right.')
  }
  const salt = randomBytes(16).toString('hex')
  q.saveAuthRow(getDb(), { salt, hash: hashPassword(input.newPassword, salt) })
  return null
}
