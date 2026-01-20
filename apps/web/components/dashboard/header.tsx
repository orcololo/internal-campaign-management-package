"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { CampaignSwitcher } from "@/components/features/campaigns/campaign-switcher";
import { DashboardBreadcrumbs } from "./breadcrumbs";
import { UserNav } from "./user-nav";
import { SearchDialog, useSearchDialog } from "./search-dialog";
import { NotificationsBell } from "@/components/features/notifications/notifications-bell";

export function DashboardHeader() {
  const { open, setOpen } = useSearchDialog();

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
          {/* Sidebar Trigger */}
          <SidebarTrigger className="-ml-2 flex-shrink-0" />

          {/* Campaign Switcher */}
          <div className="hidden lg:block flex-shrink-0">
            <CampaignSwitcher />
          </div>

          {/* Breadcrumbs - Center */}
          <div className="flex-1 flex items-center justify-center min-w-0 px-4">
            <DashboardBreadcrumbs />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search Button */}
            <Button
              variant="outline"
              className="relative h-9 w-9 p-0 xl:h-9 xl:w-64 xl:justify-start xl:px-3"
              onClick={() => setOpen(true)}
            >
              <Search className="size-4 xl:mr-2" />
              <span className="hidden xl:inline-flex">Buscar...</span>
              <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>

            {/* Notifications */}
            <NotificationsBell />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <UserNav />
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
