import { useState } from 'react'

import { defaultSettings } from '@/features/settings/types'
import { DataContext, type DataContextValue } from './data-context'

export function DataProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [settings, setSettings] = useState(defaultSettings)

  const value: DataContextValue = {
    settings,
    updateSettings: (patch) => setSettings((prev) => ({ ...prev, ...patch }))
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
