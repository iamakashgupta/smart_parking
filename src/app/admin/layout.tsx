import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/sidebar-nav";
import { UserNav } from "@/components/dashboard/user-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 md:justify-end">
          <SidebarTrigger className="md:hidden" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
            </Button>
            <UserNav />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
