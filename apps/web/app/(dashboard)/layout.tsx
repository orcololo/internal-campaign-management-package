"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { LocationsSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <LocationsSidebar />
      <SidebarInset className="overflow-hidden flex flex-col">
        <DashboardHeader />
        <div className="flex-1 overflow-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
