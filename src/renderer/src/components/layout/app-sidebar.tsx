import { NavLink, useLocation } from 'react-router'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { Logo } from './logo'
import { isNavActive, navGroups, settingsItem, type NavItem } from './nav-config'

function NavButton({ item }: { item: NavItem }): React.JSX.Element {
  const { pathname } = useLocation()

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="h-9"
        tooltip={item.label}
        isActive={isNavActive(item.path, pathname)}
        render={<NavLink to={item.path} />}
      >
        <item.icon />
        <span>{item.label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar(): React.JSX.Element {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="p-3">
        <div className="flex items-center gap-2 px-1">
          <Logo className="size-6" />
          <span className="truncate text-sm group-data-[collapsible=icon]:hidden">
            Babar Trades
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-1">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-1">
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <NavButton key={item.path} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarMenu>
          <NavButton item={settingsItem} />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
