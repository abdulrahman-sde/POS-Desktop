import { z } from 'zod'

export const MONEY_DECIMALS_MESSAGE = 'Use at most 2 numbers after the dot, like 150.50.'

export const roundMoney = (amount: number): number =>
  Math.round(Number((amount * 100).toPrecision(12))) / 100

export const isMoney = (amount: number): boolean =>
  Number.isFinite(amount) && Math.abs(amount * 100 - Math.round(amount * 100)) < 1e-6

export const moneyAboveZero = (message: string) =>
  z.number({ error: message }).positive(message).refine(isMoney, MONEY_DECIMALS_MESSAGE)

export const moneyFromZero = (message: string) =>
  z.number({ error: message }).min(0, message).refine(isMoney, MONEY_DECIMALS_MESSAGE)
