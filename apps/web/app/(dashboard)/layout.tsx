"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { LocationsSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { CommandPalette } from "@/components/ui/command-palette";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useKeyboardShortcuts();

  return (
    <SidebarProvider>
      <LocationsSidebar />
      <CommandPalette />
      <SidebarInset className="overflow-hidden flex flex-col">
        <DashboardHeader />
        <div className="flex-1 overflow-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
