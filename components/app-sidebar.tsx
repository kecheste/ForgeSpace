'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser, useClerk } from '@clerk/nextjs';
import {
  LayoutGrid,
  Sparkles,
  Users2,
  LineChart,
  Settings2,
  LifeBuoy,
  LogOut,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  Hammer,
} from 'lucide-react';
import { useSidebar } from '@/components/providers/sidebar-provider';
import { useUserProfile } from '@/components/providers/user-profile-provider';

const navigation = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGrid,
  },
  {
    title: 'Ideas',
    href: '/dashboard/ideas',
    icon: Sparkles,
  },
  {
    title: 'Workspaces',
    href: '/dashboard/workspaces',
    icon: Users2,
  },
  {
    title: 'AI Analyzer',
    href: '/dashboard/analyzer',
    icon: LineChart,
  },
  {
    title: 'Tools',
    href: '/dashboard/tools',
    icon: Hammer,
  },
];

const secondaryNavigation = [
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings2,
  },
  {
    title: 'Help',
    href: '/dashboard/help',
    icon: LifeBuoy,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { collapsed, toggleSidebar } = useSidebar();
  const { displayName, avatarInitials, loading } = useUserProfile();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div
      className={cn(
        'flex h-full flex-col border-r bg-background transition-all duration-300 ease-in-out relative',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className={cn(
          'absolute -right-3 top-4 h-6 w-6 p-0 rounded-full border bg-background z-50 shadow-sm hover:bg-muted',
          collapsed ? 'rotate-180' : ''
        )}
      >
        {collapsed ? (
          <PanelLeftOpen className="h-3.5 w-3.5" />
        ) : (
          <PanelLeftClose className="h-3.5 w-3.5" />
        )}
      </Button>

      <div className="flex h-16 items-center border-b px-4">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity w-full"
        >
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-lg tracking-tight">
              ForgeSpace
            </span>
          )}
        </Link>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-4 py-4">
          <div className="px-2 py-2">
            {!collapsed && (
              <h2 className="mb-2 px-2 text-xs font-medium tracking-tight text-muted-foreground uppercase">
                Overview
              </h2>
            )}
            <div className="space-y-1">
              {navigation.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start transition-colors group',
                    pathname === item.href && 'bg-secondary font-medium',
                    collapsed && 'justify-center px-2'
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon
                      className={cn(
                        'h-4 w-4 transition-colors flex-shrink-0',
                        !collapsed && 'mr-3',
                        pathname === item.href
                          ? 'text-primary'
                          : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                    {!collapsed && (
                      <span
                        className={cn(
                          'truncate',
                          pathname === item.href
                            ? 'text-primary'
                            : 'text-muted-foreground group-hover:text-foreground'
                        )}
                      >
                        {item.title}
                      </span>
                    )}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          <div className="px-2 py-2">
            {!collapsed && (
              <h2 className="mb-2 px-2 text-xs font-medium tracking-tight text-muted-foreground uppercase">
                Support
              </h2>
            )}
            <div className="space-y-1">
              {secondaryNavigation.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start transition-colors group',
                    pathname === item.href && 'bg-secondary font-medium',
                    collapsed && 'justify-center px-2'
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon
                      className={cn(
                        'h-4 w-4 transition-colors flex-shrink-0',
                        !collapsed && 'mr-3',
                        pathname === item.href
                          ? 'text-primary'
                          : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                    {!collapsed && (
                      <span
                        className={cn(
                          'truncate',
                          pathname === item.href
                            ? 'text-primary'
                            : 'text-muted-foreground group-hover:text-foreground'
                        )}
                      >
                        {item.title}
                      </span>
                    )}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="border-t p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start hover:bg-accent transition-colors group',
                collapsed && 'justify-center px-2'
              )}
            >
              <Avatar
                className={cn(
                  'h-6 w-6 transition-all flex-shrink-0',
                  !collapsed && 'mr-2',
                  collapsed ? 'ring-0' : 'ring-2 ring-primary/10'
                )}
              >
                <AvatarImage src={user?.imageUrl} alt={displayName} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {avatarInitials}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 text-left overflow-hidden">
                  <p className="text-sm font-medium leading-none truncate">
                    {loading ? 'Loading...' : displayName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {user?.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            align="start"
            forceMount
            side={collapsed ? 'right' : 'top'}
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none truncate">
                  {loading ? 'Loading...' : displayName}
                </p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                  {user?.emailAddresses[0]?.emailAddress}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="w-full">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="w-full">
                <Settings2 className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
