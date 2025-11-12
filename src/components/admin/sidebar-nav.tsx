'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ParkingSquare,
  BookCopy,
  Users,
  BarChart3,
  Cpu,
  LogOut,
  Settings
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
import { Separator } from '../ui/separator';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/lots', label: 'Lot Management', icon: ParkingSquare },
  { href: '/admin/bookings', label: 'All Bookings', icon: BookCopy },
  { href: '/admin/simulator', label: 'IoT Simulator', icon: Cpu },
];

export function AdminSidebar() {
  const pathname = usePathname();
  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Icons.logo className="w-8 h-8 text-primary" />
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-foreground group-data-[collapsible=icon]:hidden">
              SmartPark
            </span>
             <span className="text-sm font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">
              Admin Panel
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
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
      </SidebarContent>
       <SidebarFooter className="group-data-[collapsible=icon]:hidden">
         <Separator className="my-2" />
        <SidebarMenu>
           <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={{ children: 'Main Dashboard', side: 'right' }}>
                <Link href="/dashboard">
                  <LogOut />
                  <span>Exit Admin</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
