import { createContext, useContext } from 'react'

import type { ShopSettings } from '@/features/settings/types'

export type DataContextValue = {
  settings: ShopSettings
  updateSettings: (patch: Partial<ShopSettings>) => void
}

export const DataContext = createContext<DataContextValue | null>(null)

export function useData(): DataContextValue {
  const value = useContext(DataContext)
  if (!value) throw new Error('useData must be used inside <DataProvider>')
  return value
}
