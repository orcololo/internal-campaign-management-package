"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Map of paths to friendly names
const pathLabels: Record<string, string> = {
  dashboard: "Dashboard",
  voters: "Eleitores",
  analytics: "Análises",
  calendar: "Calendário",
  maps: "Mapas",
  locations: "Localizações",
  favorites: "Favoritos",
  recents: "Recentes",
  settings: "Configurações",
  profile: "Perfil",
  new: "Novo",
  edit: "Editar",
};

export function DashboardBreadcrumbs() {
  const pathname = usePathname();

  // Split pathname and filter empty segments
  const segments = pathname.split("/").filter(Boolean);

  // Build breadcrumb items
  const breadcrumbItems = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join("/")}`;
    const label = pathLabels[segment] || segment;
    const isLast = index === segments.length - 1;

    return {
      label,
      path,
      isLast,
    };
  });

  // Don't show breadcrumbs on homepage
  if (segments.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">
              <Home className="size-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <BreadcrumbSeparator>
              <ChevronRight className="size-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.path}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
