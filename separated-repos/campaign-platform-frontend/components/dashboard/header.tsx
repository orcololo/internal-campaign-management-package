"use client";

import * as React from "react";
import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CampaignSwitcher } from "@/components/features/campaigns/campaign-switcher";
import { DashboardBreadcrumbs } from "./breadcrumbs";
import { UserNav } from "./user-nav";
import { SearchDialog, useSearchDialog } from "./search-dialog";

// Mock notifications
const notifications = [
  {
    id: "1",
    title: "Novo eleitor cadastrado",
    description: "Maria Santos foi adicionada à base",
    time: "há 5 minutos",
    read: false,
  },
  {
    id: "2",
    title: "Evento amanhã",
    description: "Reunião com lideranças às 14h",
    time: "há 1 hora",
    read: false,
  },
  {
    id: "3",
    title: "Meta atingida",
    description: "500 eleitores cadastrados!",
    time: "há 2 horas",
    read: true,
  },
];

export function DashboardHeader() {
  const { open, setOpen } = useSearchDialog();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {
    alert("Marcar todas como lidas - Em desenvolvimento");
  };

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="size-5" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-[10px]"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notificações</span>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                      onClick={handleMarkAllAsRead}
                    >
                      Marcar todas como lidas
                    </Button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex-col items-start p-3"
                    >
                      <div className="flex items-start gap-2 w-full">
                        {!notification.read && (
                          <div className="size-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

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
