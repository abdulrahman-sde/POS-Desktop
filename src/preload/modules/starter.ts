import type { StarterChoice, StarterStatus } from '@shared/starter/types'
import { call } from './call'

export const starterPreload = {
  status: () => call<StarterStatus>('starter:status'),
  import: () => call<StarterChoice>('starter:import')
}
