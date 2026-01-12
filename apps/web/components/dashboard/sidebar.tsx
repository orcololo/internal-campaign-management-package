"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MapPin,
  Heart,
  Clock,
  Settings,
  ChevronsUpDown,
  LogOut,
  Home,
  Users,
  BarChart3,
  Calendar,
} from "lucide-react";
import { useMapsStore } from "@/store/maps-store";

const campaignNavItems = [
  { id: "dashboard", title: "Dashboard", icon: Home, href: "/" },
  { id: "voters", title: "Eleitores", icon: Users, href: "/voters" },
  { id: "analytics", title: "Análises", icon: BarChart3, href: "/analytics" },
  {
    id: "calendar",
    title: "Calendário",
    icon: Calendar,
    href: "/calendar",
    badge: "3",
  },
];

const mapsNavItems = [
  { id: "maps", title: "Mapa", icon: MapPin, href: "/maps" },
  { id: "favorites", title: "Favoritos", icon: Heart, href: "/favorites" },
  { id: "recents", title: "Recentes", icon: Clock, href: "/recents" },
];

export function LocationsSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { locations, getRecentLocations } = useMapsStore();

  const favoriteCount = locations.filter((l) => l.isFavorite).length;
  const recentCount = getRecentLocations().length;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="px-2.5 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 w-full hover:bg-sidebar-accent rounded-md p-1 -m-1 transition-colors shrink-0">
              <div className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background shrink-0">
                <MapPin className="size-4" />
              </div>
              <div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium">Ele.ia dashboard</span>
                <ChevronsUpDown className="size-3 text-muted-foreground" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem>
              <Settings className="size-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="size-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      <SidebarContent className="px-2.5">
        {/* Campaign Navigation */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-0 h-6">
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              Campanha
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {campaignNavItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="h-8"
                    >
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Maps Navigation */}
        <SidebarGroup className="p-0 mt-4">
          <SidebarGroupLabel className="px-0 h-6">
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              Localizações
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mapsNavItems.map((item) => {
                const isActive = pathname === item.href;
                let badge: number | undefined;
                if (item.id === "favorites") badge = favoriteCount;
                if (item.id === "recents") badge = recentCount;

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="h-8"
                    >
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {badge !== undefined && badge > 0 && (
                      <SidebarMenuBadge>{badge}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2.5 pb-3">
        <div className="group-data-[collapsible=icon]:hidden space-y-3"></div>
      </SidebarFooter>
    </Sidebar>
  );
}
