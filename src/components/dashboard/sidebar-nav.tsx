
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  BookCopy,
  User,
  Settings,
  LogIn
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Icons } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/firebase';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/lots', label: 'Find Parking', icon: Map },
  { href: '/dashboard/bookings', label: 'My Bookings', icon: BookCopy },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

const ADMIN_EMAIL = 'akash@gmail.com';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, isLoading } = useUser();
  
  if (isLoading) {
    return (
      <Sidebar>
        <SidebarHeader>
           <Skeleton className="h-10 w-full" />
        </SidebarHeader>
        <SidebarContent>
           <div className="flex flex-col gap-2">
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
           </div>
        </SidebarContent>
      </Sidebar>
    )
  }
  
  const isActive = (href: string) => {
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <Icons.logo className="w-8 h-8 text-primary" />
          <span className="text-lg font-semibold text-foreground group-data-[collapsible=icon]:hidden">
            SmartPark
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {user ? (
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.href)}
                  tooltip={{ children: item.label, side: 'right' }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        ) : (
           <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/dashboard/lots')}
                  tooltip={{ children: 'Find Parking', side: 'right' }}
                >
                  <Link href="/dashboard/lots">
                    <Map />
                    <span>Find Parking</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <div className="p-4 text-center group-data-[collapsible=true]:hidden">
                  <p className="text-sm text-muted-foreground mb-4">Log in to manage bookings and your profile.</p>
                  <Button asChild className="w-full">
                    <Link href="/auth/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                    </Link>
                  </Button>
              </div>
           </SidebarMenu>
        )}
      </SidebarContent>
      {user && user.email === ADMIN_EMAIL && (
        <SidebarFooter className="group-data-[collapsible=icon]:hidden">
          <Separator className="my-2" />
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{ children: 'Admin Panel', side: 'right' }}>
                  <Link href="/admin">
                    <Settings />
                    <span>Admin Panel</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
