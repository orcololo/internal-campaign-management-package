"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  PieChart,
  ArrowUp,
  ArrowDown,
  MapPin,
  Mail,
  Phone,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Download,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Voter, VoterSortField, SortOrder } from "@/types/voters";
import { SupportLevelBadge, WhatsAppBadge } from "./voter-badges";
import { useRouter } from "next/navigation";
import { useVotersStore } from "@/store/voters-store";
import { VoterFilters } from "@/lib/api/voters";
import { showToast } from "@/lib/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Users } from "lucide-react";

interface VotersTableProps {
  data?: Voter[]; // Make optional for backward compatibility
}

function getSortIcon(
  sortField: VoterSortField,
  sortOrder: SortOrder,
  field: VoterSortField
) {
  if (sortField !== field) return <ArrowUpDown className="size-3" />;
  return sortOrder === "asc" ? (
    <ArrowUp className="size-3" />
  ) : (
    <ArrowDown className="size-3" />
  );
}

export function VotersTable({ data: propData }: VotersTableProps) {
  const router = useRouter();

  // Use store for data and actions
  const {
    voters: storeVoters,
    isLoading,
    error,
    selectedIds,
    currentPage: storePage,
    totalPages: storeTotalPages,
    perPage: storePerPage,
    fetchVoters,
    deleteVoter,
    bulkDelete,
    exportCsv,
    setPage,
    setPerPage,
    setFilters,
    toggleSelectedId,
    setSelectedIds,
    clearSelection,
    clearError,
  } = useVotersStore();

  // Use store data if available, otherwise fallback to props (for backward compatibility)
  const data = propData || storeVoters;

  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [supportLevelFilter, setSupportLevelFilter] = useState<string>("all");
  const [hasWhatsappFilter, setHasWhatsappFilter] = useState<boolean | null>(
    null
  );
  const [hasLocationFilter, setHasLocationFilter] = useState<boolean | null>(
    null
  );

  const [sortField, setSortField] = useState<VoterSortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Use local pagination state only if using prop data
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const [localItemsPerPage, setLocalItemsPerPage] = useState(10);

  // Delete confirmation state
  const [voterToDelete, setVoterToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  // Determine if we're using store or local state
  const usingStore = !propData;
  const currentPage = usingStore ? storePage || 1 : localCurrentPage;
  const itemsPerPage = usingStore ? storePerPage || 20 : localItemsPerPage;
  const totalPages = usingStore
    ? storeTotalPages || 1
    : Math.ceil((data?.length || 0) / itemsPerPage);

  // Fetch voters on mount if using store
  useEffect(() => {
    if (usingStore) {
      fetchVoters({
        page: 1,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
    }
  }, [usingStore, fetchVoters]);

  // Update filters in store
  useEffect(() => {
    if (usingStore) {
      const filters: Partial<VoterFilters> = {};

      if (searchQuery) filters.search = searchQuery;
      if (cityFilter !== "all") filters.city = cityFilter;
      if (stateFilter !== "all") filters.state = stateFilter;
      if (supportLevelFilter !== "all")
        filters.supportLevel = supportLevelFilter;

      setFilters(filters);

      // Debounce the fetch
      const timeout = setTimeout(() => {
        fetchVoters({
          ...filters,
          page: 1,
          limit: itemsPerPage,
          sortBy: sortField,
          sortOrder,
        });
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [
    usingStore,
    searchQuery,
    cityFilter,
    stateFilter,
    supportLevelFilter,
    sortField,
    sortOrder,
    itemsPerPage,
    setFilters,
    fetchVoters,
  ]);

  // Show error toast
  useEffect(() => {
    if (error) {
      showToast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Extract unique cities and states for filters
  const uniqueCities = useMemo(() => {
    const cities = Array.from(
      new Set(data.map((v) => v.city).filter(Boolean))
    ).sort();
    return cities;
  }, [data]);

  const uniqueStates = useMemo(() => {
    const states = Array.from(
      new Set(data.map((v) => v.state).filter(Boolean))
    ).sort();
    return states;
  }, [data]);

  // For local filtering (when using prop data), otherwise server handles it
  const filteredAndSortedVoters = useMemo(() => {
    // If using store, return data as-is (server-side filtering)
    if (usingStore) {
      return data;
    }

    // Otherwise, do client-side filtering
    let result = [...data];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (voter) =>
          voter.name.toLowerCase().includes(query) ||
          voter.email?.toLowerCase().includes(query) ||
          voter.phone?.toLowerCase().includes(query) ||
          voter.city.toLowerCase().includes(query)
      );
    }

    // Apply city filter
    if (cityFilter !== "all") {
      result = result.filter((voter) => voter.city === cityFilter);
    }

    // Apply state filter
    if (stateFilter !== "all") {
      result = result.filter((voter) => voter.state === stateFilter);
    }

    // Apply support level filter
    if (supportLevelFilter !== "all") {
      result = result.filter(
        (voter) => voter.supportLevel === supportLevelFilter
      );
    }

    // Apply WhatsApp filter
    if (hasWhatsappFilter !== null) {
      result = result.filter(
        (voter) => voter.hasWhatsapp === hasWhatsappFilter
      );
    }

    // Apply location filter
    if (hasLocationFilter !== null) {
      result = result.filter(
        (voter) =>
          (voter.latitude !== undefined && voter.longitude !== undefined) ===
          hasLocationFilter
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "email":
          comparison = (a.email || "").localeCompare(b.email || "");
          break;
        case "city":
          comparison = a.city.localeCompare(b.city);
          break;
        case "supportLevel":
          const levels: Record<string, number> = {
            MUITO_FAVORAVEL: 5,
            FAVORAVEL: 4,
            NEUTRO: 3,
            DESFAVORAVEL: 2,
            MUITO_DESFAVORAVEL: 1,
            NAO_DEFINIDO: 0,
          };
          comparison =
            (levels[a.supportLevel || "NAO_DEFINIDO"] || 0) -
            (levels[b.supportLevel || "NAO_DEFINIDO"] || 0);
          break;
        case "createdAt":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [
    usingStore,
    data,
    searchQuery,
    cityFilter,
    stateFilter,
    supportLevelFilter,
    hasWhatsappFilter,
    hasLocationFilter,
    sortField,
    sortOrder,
  ]);

  const paginatedVoters = useMemo(() => {
    // If using store, data is already paginated
    if (usingStore) {
      return filteredAndSortedVoters;
    }

    // Otherwise, paginate locally
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedVoters.slice(startIndex, startIndex + itemsPerPage);
  }, [usingStore, filteredAndSortedVoters, currentPage, itemsPerPage]);

  const toggleSort = (field: VoterSortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }

    // If using store, trigger refetch with new sort
    if (usingStore) {
      fetchVoters({
        search: searchQuery || undefined,
        city: cityFilter !== "all" ? cityFilter : undefined,
        state: stateFilter !== "all" ? stateFilter : undefined,
        supportLevel:
          supportLevelFilter !== "all" ? supportLevelFilter : undefined,
        page: currentPage,
        limit: itemsPerPage,
        sortBy: field,
        sortOrder:
          sortField === field ? (sortOrder === "asc" ? "desc" : "asc") : "asc",
      });
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedVoters.length) {
      if (usingStore) {
        clearSelection();
      } else {
        setSelectedIds([]);
      }
    } else {
      if (usingStore) {
        setSelectedIds(paginatedVoters.map((voter) => voter.id));
      } else {
        setSelectedIds(paginatedVoters.map((voter) => voter.id));
      }
    }
  };

  const handleToggleSelectVoter = (id: string) => {
    if (usingStore) {
      toggleSelectedId(id);
    } else {
      setSelectedIds(
        selectedIds.includes(id)
          ? selectedIds.filter((i) => i !== id)
          : [...selectedIds, id]
      );
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCityFilter("all");
    setStateFilter("all");
    setSupportLevelFilter("all");
    setHasWhatsappFilter(null);
    setHasLocationFilter(null);
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    cityFilter !== "all" ||
    stateFilter !== "all" ||
    supportLevelFilter !== "all" ||
    hasWhatsappFilter !== null ||
    hasLocationFilter !== null;

  const handlePageChange = (page: number) => {
    if (usingStore) {
      setPage(page);
      clearSelection();
    } else {
      setLocalCurrentPage(page);
      setSelectedIds([]);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    const newPerPage = Number(value);
    if (usingStore) {
      setPerPage(newPerPage);
      clearSelection();
    } else {
      setLocalItemsPerPage(newPerPage);
      setLocalCurrentPage(1);
      setSelectedIds([]);
    }
  };

  // Handle delete voter
  const handleDeleteVoter = (id: string) => {
    setVoterToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteVoter = async () => {
    if (!voterToDelete) return;

    if (usingStore) {
      const success = await deleteVoter(voterToDelete);
      if (success) {
        showToast.success("Voter deleted successfully");
      }
    } else {
      showToast.error("Delete not available in offline mode");
    }
    setShowDeleteDialog(false);
    setVoterToDelete(null);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    setShowBulkDeleteDialog(true);
  };

  const confirmBulkDelete = async () => {
    if (usingStore) {
      const success = await bulkDelete(selectedIds);
      if (success) {
        showToast.success(`${selectedIds.length} voters deleted`);
      }
    } else {
      showToast.error("Bulk delete not available in offline mode");
    }
    setShowBulkDeleteDialog(false);
  };

  // Handle export
  const handleExport = async () => {
    if (usingStore) {
      await exportCsv({
        search: searchQuery || undefined,
        city: cityFilter !== "all" ? cityFilter : undefined,
        state: stateFilter !== "all" ? stateFilter : undefined,
        supportLevel:
          supportLevelFilter !== "all" ? supportLevelFilter : undefined,
      });
      showToast.success("Export started");
    } else {
      showToast.error("Export not available in offline mode");
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-xl border overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3.5 border-b">
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-base">Gerenciar Eleitores</h3>
          <div className="h-5 w-px bg-border hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 w-[200px] text-sm bg-muted/50 border-border/50"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 bg-muted/50 border-border/50"
                >
                  <SlidersHorizontal className="size-3.5" />
                  <span>Filtros</span>
                  {hasActiveFilters && (
                    <span className="size-1.5 rounded-full bg-primary" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    Cidade
                  </p>
                  <Select value={cityFilter} onValueChange={setCityFilter}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {uniqueCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    Estado
                  </p>
                  <Select value={stateFilter} onValueChange={setStateFilter}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {uniqueStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    Nível de Apoio
                  </p>
                  <div className="space-y-1">
                    <DropdownMenuCheckboxItem
                      checked={supportLevelFilter === "all"}
                      onCheckedChange={() => setSupportLevelFilter("all")}
                    >
                      Todos
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={supportLevelFilter === "MUITO_FAVORAVEL"}
                      onCheckedChange={() =>
                        setSupportLevelFilter("MUITO_FAVORAVEL")
                      }
                    >
                      Muito Favorável
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={supportLevelFilter === "FAVORAVEL"}
                      onCheckedChange={() => setSupportLevelFilter("FAVORAVEL")}
                    >
                      Favorável
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={supportLevelFilter === "NEUTRO"}
                      onCheckedChange={() => setSupportLevelFilter("NEUTRO")}
                    >
                      Neutro
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={supportLevelFilter === "DESFAVORAVEL"}
                      onCheckedChange={() =>
                        setSupportLevelFilter("DESFAVORAVEL")
                      }
                    >
                      Desfavorável
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={supportLevelFilter === "MUITO_DESFAVORAVEL"}
                      onCheckedChange={() =>
                        setSupportLevelFilter("MUITO_DESFAVORAVEL")
                      }
                    >
                      Muito Desfavorável
                    </DropdownMenuCheckboxItem>
                  </div>
                </div>
                {hasActiveFilters && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={clearFilters}>
                      Limpar filtros
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 bg-muted/50 border-border/50"
                >
                  <ArrowUpDown className="size-3.5" />
                  <span>Ordenar</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => toggleSort("name")}>
                  Nome{" "}
                  {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleSort("email")}>
                  Email{" "}
                  {sortField === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleSort("city")}>
                  Cidade{" "}
                  {sortField === "city" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleSort("supportLevel")}>
                  Apoio{" "}
                  {sortField === "supportLevel" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleSort("createdAt")}>
                  Data{" "}
                  {sortField === "createdAt" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              className="h-8 gap-1.5"
              onClick={handleBulkDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Trash2 className="size-3.5" />
              )}
              <span>Delete {selectedIds.length}</span>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 bg-muted/50 border-border/50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Download className="size-3.5" />
                )}
                <span className="hidden sm:inline">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExport}>
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-8 bg-muted/50 border-border/50"
              >
                <PieChart className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Ver análises</DropdownMenuItem>
              <DropdownMenuItem>Distribuição de apoio</DropdownMenuItem>
              <DropdownMenuItem>Cobertura geográfica</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search/Filters */}
      <div className="sm:hidden flex flex-wrap items-center gap-2 px-4 py-3 border-b">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 w-full text-sm bg-muted/50 border-border/50"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 bg-muted/50 border-border/50"
        >
          <SlidersHorizontal className="size-3.5" />
          {hasActiveFilters && (
            <span className="size-1.5 rounded-full bg-primary" />
          )}
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-muted/30">
              <TableHead className="w-[200px]">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={
                      selectedIds.length === paginatedVoters.length &&
                      paginatedVoters.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
                    className="border-border/50 bg-background/70"
                  />
                  <button
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                    onClick={() => toggleSort("name")}
                  >
                    <span>Nome</span>
                    {getSortIcon(sortField, sortOrder, "name")}
                  </button>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Mail className="size-3.5" />
                  <span>Email</span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="size-3.5" />
                  <span>Telefone</span>
                </div>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                  onClick={() => toggleSort("city")}
                >
                  <MapPin className="size-3.5" />
                  <span>Localização</span>
                  {getSortIcon(sortField, sortOrder, "city")}
                </button>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span>Apoio</span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span>Zona/Seção</span>
                </div>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                      <div className="h-6 w-6 rounded-full bg-muted animate-pulse" />
                      <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-40 rounded bg-muted animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-28 rounded bg-muted animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-36 rounded bg-muted animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-6 w-20 rounded-full bg-muted animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-8 w-8 rounded bg-muted animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedVoters.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-[400px] text-center"
                >
                  <EmptyState
                    icon={Users}
                    title="Nenhum eleitor encontrado"
                    description="Tente ajustar seus filtros ou adicione um novo eleitor."
                    action={{
                      label: "Adicionar Eleitor",
                      onClick: () => router.push("/voters/new"),
                    }}
                  />
                </TableCell>
              </TableRow>
            ) : (
              paginatedVoters.map((voter) => (
                <TableRow
                  key={voter.id}
                  className="border-border/50 cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/voters/${voter.id}`)}
                >
                  <TableCell>
                    <div
                      className="flex items-center gap-2.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={selectedIds.includes(voter.id)}
                        onCheckedChange={() =>
                          handleToggleSelectVoter(voter.id)
                        }
                        className="border-border/50 bg-background/70"
                      />
                      <Avatar className="size-6">
                        <AvatarFallback className="text-xs">
                          {voter.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{voter.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[180px]">
                    <span className="text-sm truncate block">
                      {voter.email || "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm whitespace-nowrap">
                        {voter.phone || "-"}
                      </span>
                      <WhatsAppBadge hasWhatsapp={voter.hasWhatsapp} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">
                        {voter.city}, {voter.state}
                      </span>
                      {(voter.latitude || voter.longitude) && (
                        <span className="text-xs text-muted-foreground">
                          Com localização
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {voter.supportLevel && (
                      <SupportLevelBadge level={voter.supportLevel} />
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {voter.electoralZone && voter.electoralSection
                        ? `${voter.electoralZone}/${voter.electoralSection}`
                        : "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/voters/${voter.id}`);
                          }}
                        >
                          <Eye className="size-4 mr-2" />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/voters/${voter.id}/edit`);
                          }}
                        >
                          <Edit className="size-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteVoter(voter.id);
                          }}
                        >
                          <Trash2 className="size-4 mr-2" />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
            {Math.min(
              currentPage * itemsPerPage,
              usingStore ? storeVoters.length : filteredAndSortedVoters.length
            )}{" "}
            de{" "}
            {usingStore
              ? totalPages * itemsPerPage
              : filteredAndSortedVoters.length}{" "}
            eleitores
          </span>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">Mostrar</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
              disabled={isLoading}
            >
              <SelectTrigger className="h-8 w-[70px] bg-muted/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="hidden sm:inline">por página</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <div className="flex items-center gap-1 mx-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="icon"
                  className="size-8"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Excluir Eleitor"
        description="Tem certeza? Esta ação não pode ser desfeita."
        onConfirm={confirmDeleteVoter}
        variant="destructive"
        confirmText="Excluir"
      />

      <ConfirmDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        title={`Excluir ${selectedIds.length} Eleitores`}
        description="Tem certeza? Esta ação não pode ser desfeita."
        onConfirm={confirmBulkDelete}
        variant="destructive"
        confirmText="Excluir"
      />
    </div>
  );
}
