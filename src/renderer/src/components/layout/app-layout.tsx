import { useEffect, useState } from 'react'
import { Download } from 'reicon-react'
import { Outlet, useLocation } from 'react-router'

import { Button } from '@/components/ui/button'
import { UpdateButton } from '@/features/settings/components/update-button'
import { usePrefetchSettings } from '@/features/settings/hooks/use-prefetch-settings'
import { useBackup } from '@/hooks/use-backup'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebar } from './app-sidebar'
import { findNavItem } from './nav-config'

export function AppLayout(): React.JSX.Element {
  const { pathname } = useLocation()
  const title = findNavItem(pathname)?.label ?? ''
  const saveBackup = useBackup()
  usePrefetchSettings()

  // On a small window the sidebar folds to icons by itself, so the page gets the room.
  // He can still open or close it with the button. It only re-decides when the window crosses 1024px.
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024)
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)')
    const onChange = (event: MediaQueryListEvent): void => setSidebarOpen(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return (
    <TooltipProvider>
      <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <AppSidebar />
        <SidebarInset className="h-[calc(100svh-(--spacing(4)))] min-w-0 overflow-hidden">
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <span className="text-sm text-muted-foreground">{title}</span>
            {/* Far right of the top bar: save a copy of all shop data */}
            <div className="ml-auto flex items-center gap-2">
              <UpdateButton />
              <Button
                variant="outline"
                size="sm"
                title="Save a copy of your data"
                onClick={saveBackup}
              >
                <Download data-icon="inline-start" />
                <span className="hidden sm:inline">Backup</span>
              </Button>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-4">
            {/* The current page is rendered here */}
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
