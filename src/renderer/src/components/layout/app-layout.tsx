import { Outlet, useLocation } from 'react-router'

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebar } from './app-sidebar'
import { findNavItem } from './nav-config'

export function AppLayout(): React.JSX.Element {
  const { pathname } = useLocation()
  const title = findNavItem(pathname)?.label ?? ''

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="h-[calc(100svh-(--spacing(4)))] min-w-0 overflow-hidden">
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <span className="text-sm text-muted-foreground">{title}</span>
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
