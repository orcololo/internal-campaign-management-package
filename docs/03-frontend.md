# Frontend - Next.js 14 App Router + shadcn/ui

## Arquitetura Modular de Dashboard

### Estrutura de Diretórios (Feature-First + Atomic Design)

```
apps/web/
├── app/
│   ├── (dashboard)/               # Dashboard layout group
│   │   ├── layout.tsx            # Dashboard shell layout
│   │   ├── page.tsx              # Dashboard home
│   │   ├── voters/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── edit/page.tsx
│   │   │   └── new/page.tsx
│   │   ├── campaigns/
│   │   ├── calendar/
│   │   ├── canvassing/
│   │   ├── analytics/
│   │   ├── maps/
│   │   └── settings/
│   │
│   ├── (auth)/                   # Auth pages
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   ├── api/                      # API routes
│   ├── layout.tsx                # Root layout
│   └── globals.css
│
├── components/
│   ├── ui/                       # shadcn/ui base components
│   │   ├── accordion.tsx
│   │   ├── alert.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── command.tsx
│   │   ├── context-menu.tsx
│   │   ├── data-table.tsx
│   │   ├── date-picker.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── hover-card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── menubar.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toggle.tsx
│   │   ├── tooltip.tsx
│   │   └── sonner.tsx
│   │
│   ├── dashboard/                # Dashboard-specific composites
│   │   ├── shell.tsx             # Main dashboard shell
│   │   ├── header.tsx            # Top header
│   │   ├── sidebar.tsx           # Sidebar navigation
│   │   ├── breadcrumbs.tsx       # Breadcrumb navigation
│   │   ├── search.tsx            # Global search
│   │   ├── notifications.tsx     # Notifications dropdown
│   │   ├── user-nav.tsx          # User menu
│   │   ├── stats-card.tsx        # Metric cards
│   │   ├── recent-activity.tsx   # Activity feed
│   │   └── quick-actions.tsx     # Quick action buttons
│   │
│   ├── layouts/                  # Layout components
│   │   ├── auth-layout.tsx
│   │   ├── dashboard-layout.tsx
│   │   └── marketing-layout.tsx
│   │
│   ├── features/                 # Feature modules
│   │   ├── voters/
│   │   │   ├── voters-table.tsx
│   │   │   ├── voters-filters.tsx
│   │   │   ├── voter-form.tsx
│   │   │   ├── voter-card.tsx
│   │   │   ├── voter-details.tsx
│   │   │   ├── voter-actions.tsx
│   │   │   ├── bulk-import-dialog.tsx
│   │   │   └── export-dialog.tsx
│   │   ├── calendar/
│   │   │   ├── event-calendar.tsx
│   │   │   ├── event-form.tsx
│   │   │   ├── event-card.tsx
│   │   │   ├── event-timeline.tsx
│   │   │   └── event-filters.tsx
│   │   ├── analytics/
│   │   │   ├── overview-chart.tsx
│   │   │   ├── voter-demographics.tsx
│   │   │   ├── engagement-chart.tsx
│   │   │   ├── conversion-funnel.tsx
│   │   │   └── geographic-heatmap.tsx
│   │   ├── maps/
│   │   │   ├── voter-map.tsx
│   │   │   ├── geofence-editor.tsx
│   │   │   ├── route-planner.tsx
│   │   │   └── map-layers.tsx
│   │   └── campaigns/
│   │       ├── campaign-card.tsx
│   │       ├── campaign-form.tsx
│   │       └── campaign-switcher.tsx
│   │
│   ├── composed/                 # Composed/complex components
│   │   ├── data-table/
│   │   │   ├── data-table.tsx
│   │   │   ├── data-table-toolbar.tsx
│   │   │   ├── data-table-pagination.tsx
│   │   │   ├── data-table-column-header.tsx
│   │   │   └── data-table-faceted-filter.tsx
│   │   ├── forms/
│   │   │   ├── auto-form.tsx
│   │   │   ├── field-wrapper.tsx
│   │   │   ├── form-section.tsx
│   │   │   └── multi-step-form.tsx
│   │   ├── charts/
│   │   │   ├── area-chart.tsx
│   │   │   ├── bar-chart.tsx
│   │   │   ├── line-chart.tsx
│   │   │   ├── pie-chart.tsx
│   │   │   └── metric-card.tsx
│   │   └── feedback/
│   │       ├── empty-state.tsx
│   │       ├── error-boundary.tsx
│   │       ├── loading-spinner.tsx
│   │       └── confirmation-dialog.tsx
│   │
│   └── providers/                # Context providers
│       ├── theme-provider.tsx
│       ├── query-provider.tsx
│       ├── toast-provider.tsx
│       └── auth-provider.tsx
│
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   ├── endpoints/
│   │   └── types.ts
│   ├── hooks/
│   │   ├── use-toast.ts
│   │   ├── use-media-query.ts
│   │   ├── use-debounce.ts
│   │   └── use-local-storage.ts
│   ├── utils/
│   │   ├── cn.ts
│   │   ├── format.ts
│   │   └── validators.ts
│   └── stores/
│       ├── auth.ts
│       ├── campaign.ts
│       └── ui.ts
│
└── types/
    ├── api.ts
    ├── database.ts
    └── components.ts
```

---

## shadcn/ui Setup Completo

### Instalação de Todos os Componentes

```bash
# Inicializar shadcn/ui
npx shadcn-ui@latest init

# Instalar TODOS os componentes disponíveis
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add alert-dialog
npx shadcn-ui@latest add aspect-ratio
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add breadcrumb
npx shadcn-ui@latest add button
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add card
npx shadcn-ui@latest add carousel
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add collapsible
npx shadcn-ui@latest add command
npx shadcn-ui@latest add context-menu
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add drawer
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add form
npx shadcn-ui@latest add hover-card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add input-otp
npx shadcn-ui@latest add label
npx shadcn-ui@latest add menubar
npx shadcn-ui@latest add navigation-menu
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add resizable
npx shadcn-ui@latest add scroll-area
npx shadcn-ui@latest add select
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add sonner
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add table
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add toggle
npx shadcn-ui@latest add toggle-group
npx shadcn-ui@latest add tooltip

# Charts (Recharts)
npm install recharts
npx shadcn-ui@latest add chart
```

---

## Dashboard Shell Layout

### Main Dashboard Layout

```typescript
// app/(dashboard)/layout.tsx
import { DashboardShell } from '@/components/dashboard/shell';
import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toaster } from '@/components/ui/sonner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <ScrollArea className="h-full">
            <div className="container py-6">
              {children}
            </div>
          </ScrollArea>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
```

### Dashboard Sidebar (Composable)

```typescript
// components/dashboard/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Users,
  Calendar,
  Map,
  BarChart3,
  Settings,
  MessageSquare,
  FileText,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  {
    name: 'Eleitores',
    icon: Users,
    badge: '1.2k',
    children: [
      { name: 'Todos', href: '/voters' },
      { name: 'Importar', href: '/voters/import' },
      { name: 'Grupos', href: '/voters/groups' },
    ]
  },
  { name: 'Calendário', href: '/calendar', icon: Calendar, badge: '3' },
  { name: 'Mapas', href: '/maps', icon: Map },
  {
    name: 'Análises',
    icon: BarChart3,
    children: [
      { name: 'Visão Geral', href: '/analytics' },
      { name: 'Demografia', href: '/analytics/demographics' },
      { name: 'Engajamento', href: '/analytics/engagement' },
    ]
  },
  { name: 'Porta a Porta', href: '/canvassing', icon: MessageSquare },
  { name: 'Documentos', href: '/documents', icon: FileText },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-muted/40">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center px-6 border-b">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">CP</span>
            </div>
            <span>Campaign Platform</span>
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} pathname={pathname} />
            ))}
          </nav>

          <Separator className="my-4" />

          {/* Quick Stats */}
          <div className="space-y-2 px-3">
            <h4 className="text-sm font-medium text-muted-foreground">Estatísticas</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Eleitores</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Eventos</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Meta</span>
                <Badge variant="outline">75%</Badge>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* User Profile */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/avatars/user.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">João da Silva</p>
              <p className="text-xs text-muted-foreground truncate">Coordenador</p>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ item, pathname }: any) {
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

  if (item.children) {
    return (
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between"
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </div>
            {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-6 space-y-1">
          {item.children.map((child: any) => (
            <Link key={child.href} href={child.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  pathname === child.href && "bg-muted"
                )}
              >
                {child.name}
              </Button>
            </Link>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link href={item.href}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className="w-full justify-start"
      >
        <item.icon className="h-4 w-4 mr-3" />
        <span>{item.name}</span>
        {item.badge && (
          <Badge variant="secondary" className="ml-auto">
            {item.badge}
          </Badge>
        )}
      </Button>
    </Link>
  );
}
```

### Dashboard Header

```typescript
// components/dashboard/header.tsx
'use client';

import { Search, Bell, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CommandDialog } from '@/components/ui/command';
import { Breadcrumbs } from '@/components/dashboard/breadcrumbs';
import { NotificationsDropdown } from '@/components/dashboard/notifications';
import { UserNav } from '@/components/dashboard/user-nav';
import { CampaignSwitcher } from '@/components/features/campaigns/campaign-switcher';

export function DashboardHeader() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-6 gap-4">
        {/* Campaign Switcher */}
        <CampaignSwitcher />

        {/* Breadcrumbs */}
        <Breadcrumbs />

        <div className="flex-1" />

        {/* Global Search */}
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar eleitores, eventos..."
            className="pl-9"
          />
        </div>

        {/* Actions */}
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>

        <NotificationsDropdown />
        <UserNav />
      </div>
    </header>
  );
}
```

---

## Advanced Data Tables (Reusable & Composable)

### Data Table Base Component

```typescript
// components/composed/data-table/data-table.tsx
'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataTableToolbar } from './data-table-toolbar';
import { DataTablePagination } from './data-table-pagination';
import { Skeleton } from '@/components/ui/skeleton';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  filters?: any[];
  isLoading?: boolean;
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  filters,
  isLoading,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        searchKey={searchKey}
        filters={filters}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={onRowClick ? "cursor-pointer" : ""}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
```

### Data Table Toolbar

```typescript
// components/composed/data-table/data-table-toolbar.tsx
'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './data-table-view-options';
import { DataTableFacetedFilter } from './data-table-faceted-filter';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
  filters?: {
    column: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
}

export function DataTableToolbar<TData>({
  table,
  searchKey = 'name',
  filters = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={`Filtrar por ${searchKey}...`}
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {filters.map((filter) => (
          table.getColumn(filter.column) && (
            <DataTableFacetedFilter
              key={filter.column}
              column={table.getColumn(filter.column)}
              title={filter.title}
              options={filter.options}
            />
          )
        ))}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Limpar
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
```

---

## Feature Components (Voters Example)

### Voters Table with All Features

```typescript
// app/(dashboard)/voters/page.tsx
import { VotersDataTable } from '@/components/features/voters/voters-table';
import { votersColumns } from '@/components/features/voters/voters-columns';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Download } from 'lucide-react';

async function getVoters() {
  // Fetch from API
  return [];
}

export default async function VotersPage() {
  const voters = await getVoters();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Eleitores"
        description="Gerencie sua base de eleitores"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Importar
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Novo Eleitor
            </Button>
          </>
        }
      />

      <VotersDataTable data={voters} columns={votersColumns} />
    </div>
  );
}
```

### Voters Columns Definition

```typescript
// components/features/voters/voters-columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTableColumnHeader } from '@/components/composed/data-table/data-table-column-header';
import { VoterActions } from './voter-actions';
import { Check, X, MapPin, Phone, Mail } from 'lucide-react';

export type Voter = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  city: string;
  state: string;
  zone?: string;
  section?: string;
  supportLevel?: 'high' | 'medium' | 'low';
  hasWhatsapp: boolean;
  latitude?: number;
  longitude?: number;
};

export const votersColumns: ColumnDef<Voter>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row }) => {
      const initials = row.original.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`/avatars/${row.original.id}.jpg`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-xs text-muted-foreground">
              {row.original.zone && `Zona ${row.original.zone}`}
              {row.original.section && ` • Seção ${row.original.section}`}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email = row.getValue('email') as string;
      return email ? (
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          {email}
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: 'phone',
    header: 'Telefone',
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string;
      const hasWhatsapp = row.original.hasWhatsapp;

      return phone ? (
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          {phone}
          {hasWhatsapp && (
            <Badge variant="secondary" className="ml-1">
              WhatsApp
            </Badge>
          )}
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: 'city',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Localização" />
    ),
    cell: ({ row }) => {
      const hasLocation = row.original.latitude && row.original.longitude;

      return (
        <div className="flex items-center gap-2">
          <MapPin className={cn(
            "h-4 w-4",
            hasLocation ? "text-green-500" : "text-muted-foreground"
          )} />
          <span>
            {row.original.city}, {row.original.state}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'supportLevel',
    header: 'Apoio',
    cell: ({ row }) => {
      const level = row.getValue('supportLevel') as string;
      const variants: Record<string, any> = {
        high: 'default',
        medium: 'secondary',
        low: 'outline',
      };
      const labels: Record<string, string> = {
        high: 'Alto',
        medium: 'Médio',
        low: 'Baixo',
      };

      return level ? (
        <Badge variant={variants[level]}>{labels[level]}</Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <VoterActions voter={row.original} />,
  },
];
```

---

## Advanced Forms with shadcn

### Multi-Step Form

```typescript
// components/composed/forms/multi-step-form.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Form } from '@/components/ui/form';

interface Step {
  title: string;
  description: string;
  fields: React.ReactNode;
  schema: z.ZodObject<any>;
}

interface MultiStepFormProps {
  steps: Step[];
  onSubmit: (data: any) => Promise<void>;
}

export function MultiStepForm({ steps, onSubmit }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});

  const form = useForm({
    resolver: zodResolver(steps[currentStep].schema),
    defaultValues: formData,
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = async (data: any) => {
    setFormData({ ...formData, ...data });

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      form.reset({ ...formData, ...data });
    } else {
      await onSubmit({ ...formData, ...data });
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <span className="text-sm text-muted-foreground">
              Passo {currentStep + 1} de {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <CardDescription>{steps[currentStep].description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleNext)} className="space-y-6">
            {steps[currentStep].fields}

            <Separator />

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                Voltar
              </Button>
              <Button type="submit">
                {currentStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
```

---

## Charts with Recharts + shadcn

### Metric Cards with Charts

```typescript
// components/composed/charts/metric-card.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  data?: Array<{ value: number }>;
  icon?: React.ReactNode;
}

export function MetricCard({
  title,
  value,
  change,
  trend = 'neutral',
  data = [],
  icon,
}: MetricCardProps) {
  const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className={cn("flex items-center text-xs", trendColor)}>
            <TrendIcon className="mr-1 h-3 w-3" />
            <span>{Math.abs(change)}% from last month</span>
          </div>
        )}
        {data.length > 0 && (
          <ResponsiveContainer width="100%" height={60} className="mt-2">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## Complete Dashboard Example

```typescript
// app/(dashboard)/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MetricCard } from '@/components/composed/charts/metric-card';
import { OverviewChart } from '@/components/features/analytics/overview-chart';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { Users, Calendar, TrendingUp, MapPin } from 'lucide-react';

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral da sua campanha
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de Eleitores"
          value="1,234"
          change={12.5}
          trend="up"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          data={[
            { value: 100 },
            { value: 120 },
            { value: 140 },
            { value: 160 },
            { value: 180 },
          ]}
        />
        <MetricCard
          title="Eventos este Mês"
          value="12"
          change={-2.5}
          trend="down"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Taxa de Engajamento"
          value="67%"
          change={5.2}
          trend="up"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Cobertura Geográfica"
          value="8 bairros"
          icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <OverviewChart />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="voters" className="space-y-4">
        <TabsList>
          <TabsTrigger value="voters">Eleitores</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="canvassing">Porta a Porta</TabsTrigger>
        </TabsList>
        <TabsContent value="voters" className="space-y-4">
          {/* Voter-specific analytics */}
        </TabsContent>
        <TabsContent value="events" className="space-y-4">
          {/* Event-specific analytics */}
        </TabsContent>
        <TabsContent value="canvassing" className="space-y-4">
          {/* Canvassing-specific analytics */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

## Theme Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

---

## Next Steps

1. **Maps Integration**: Mapbox/Google Maps with geofencing
2. **Real-time Updates**: WebSocket integration
3. **PDF Generation**: Reports and documents
4. **CSV Import/Export**: Bulk operations
5. **Mobile Responsive**: Tailwind breakpoints
6. **Dark Mode**: Theme provider
7. **Internationalization**: i18n setup
8. **Performance**: Code splitting, lazy loading

---

## Component Naming Conventions

- **UI Components** (shadcn): `button.tsx`, `input.tsx`
- **Feature Components**: `voters-table.tsx`, `campaign-form.tsx`
- **Composed Components**: `data-table.tsx`, `multi-step-form.tsx`
- **Layout Components**: `dashboard-layout.tsx`, `auth-layout.tsx`
- **Page Components**: `page.tsx`, `layout.tsx`

---

## Best Practices

1. **Composition over Complexity**: Build complex UIs from simple, reusable components
2. **Server Components First**: Use client components only when needed
3. **Type Safety**: Leverage TypeScript for props and API responses
4. **Accessibility**: Use ARIA attributes and semantic HTML
5. **Performance**: Optimize images, lazy load components
6. **Consistency**: Follow shadcn/ui patterns and Tailwind utilities
