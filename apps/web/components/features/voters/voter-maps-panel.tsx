"use client";

import * as React from "react";
import {
  MapPin,
  Search,
  X,
  Users,
  Phone,
  Mail,
  Filter,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Voter, SupportLevel } from "@/types/voters";
import { getTags } from "@/lib/transformers/voter-transformer";

const SUPPORT_LEVEL_COLORS: Record<SupportLevel, string> = {
  MUITO_FAVORAVEL: "#22c55e",
  FAVORAVEL: "#84cc16",
  NEUTRO: "#f59e0b",
  DESFAVORAVEL: "#f97316",
  MUITO_DESFAVORAVEL: "#ef4444",
  NAO_DEFINIDO: "#6b7280",
};

const SUPPORT_LEVEL_LABELS: Record<SupportLevel, string> = {
  MUITO_FAVORAVEL: "Muito Favorável",
  FAVORAVEL: "Favorável",
  NEUTRO: "Neutro",
  DESFAVORAVEL: "Desfavorável",
  MUITO_DESFAVORAVEL: "Muito Desfavorável",
  NAO_DEFINIDO: "Não Definido",
};

interface VoterMapsPanelProps {
  voters: Voter[];
  selectedVoterId: string | null;
  onVoterSelect: (voterId: string | null) => void;
}

export function VoterMapsPanel({
  voters,
  selectedVoterId,
  onVoterSelect,
}: VoterMapsPanelProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [supportLevelFilter, setSupportLevelFilter] = React.useState<
    SupportLevel | "all"
  >("all");
  const [hasLocationFilter, setHasLocationFilter] = React.useState(false);
  const [hasWhatsAppFilter, setHasWhatsAppFilter] = React.useState(false);
  const [hasEmailFilter, setHasEmailFilter] = React.useState(false);
  const [hasPhoneFilter, setHasPhoneFilter] = React.useState(false);
  const [selectedCities, setSelectedCities] = React.useState<string[]>([]);
  const [selectedStates, setSelectedStates] = React.useState<string[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [isPanelVisible, setIsPanelVisible] = React.useState(true);

  // Get unique cities, states, and tags
  const uniqueCities = React.useMemo(() => {
    const cities = Array.from(new Set(voters.map((v) => v.city)));
    return cities.sort();
  }, [voters]);

  const uniqueStates = React.useMemo(() => {
    const states = Array.from(new Set(voters.map((v) => v.state)));
    return states.sort();
  }, [voters]);

  const uniqueTags = React.useMemo(() => {
    const tags = Array.from(new Set(voters.flatMap((v) => getTags(v))));
    return tags.sort();
  }, [voters]);

  const filteredVoters = React.useMemo(() => {
    return voters.filter((voter) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = voter.name.toLowerCase().includes(query);
        const matchesCity = voter.city?.toLowerCase().includes(query);
        const matchesState = voter.state?.toLowerCase().includes(query);
        const matchesEmail = voter.email?.toLowerCase().includes(query);
        const matchesPhone = voter.phone?.includes(query);

        if (
          !matchesName &&
          !matchesCity &&
          !matchesState &&
          !matchesEmail &&
          !matchesPhone
        ) {
          return false;
        }
      }

      // Support level filter
      if (supportLevelFilter !== "all") {
        if (voter.supportLevel !== supportLevelFilter) {
          return false;
        }
      }

      // City filter
      if (selectedCities.length > 0) {
        if (!selectedCities.includes(voter.city)) {
          return false;
        }
      }

      // State filter
      if (selectedStates.length > 0) {
        if (!selectedStates.includes(voter.state)) {
          return false;
        }
      }

      // Tag filter
      if (selectedTags.length > 0) {
        const hasMatchingTag = selectedTags.some((tag) =>
          voter.tags.includes(tag)
        );
        if (!hasMatchingTag) {
          return false;
        }
      }

      // Has location filter
      if (hasLocationFilter) {
        if (!voter.latitude || !voter.longitude) {
          return false;
        }
      }

      // Has WhatsApp filter
      if (hasWhatsAppFilter) {
        if (!voter.hasWhatsapp) {
          return false;
        }
      }

      // Has email filter
      if (hasEmailFilter) {
        if (!voter.email) {
          return false;
        }
      }

      // Has phone filter
      if (hasPhoneFilter) {
        if (!voter.phone) {
          return false;
        }
      }

      return true;
    });
  }, [
    voters,
    searchQuery,
    supportLevelFilter,
    selectedCities,
    selectedStates,
    selectedTags,
    hasLocationFilter,
    hasWhatsAppFilter,
    hasEmailFilter,
    hasPhoneFilter,
  ]);

  const votersWithLocation = filteredVoters.filter(
    (v) => v.latitude && v.longitude
  );

  React.useEffect(() => {
    if (selectedVoterId && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedVoterId]);

  const handleVoterClick = (voter: Voter) => {
    if (selectedVoterId === voter.id) {
      onVoterSelect(null);
    } else {
      onVoterSelect(voter.id);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onVoterSelect(null);
  };

  if (!isPanelVisible) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-4 z-20 sm:hidden size-10 bg-background! shadow-xl"
        onClick={() => setIsPanelVisible(true)}
      >
        <MapPin className="size-5" />
      </Button>
    );
  }

  return (
    <div className="absolute left-4 top-4 bottom-4 z-20 flex flex-col bg-background rounded-xl shadow-xl border overflow-hidden w-80 sm:w-[400px]">
      <div className="p-3 border-b flex items-center justify-between">
        <div className="">
          <h2 className="font-semibold flex items-center gap-2">
            <Users className="size-4" />
            Mapa de Eleitores
          </h2>
          <p className="text-xs text-muted-foreground">
            {votersWithLocation.length} eleitor
            {votersWithLocation.length !== 1 ? "es" : ""} com localização
          </p>
        </div>
        <div className="flex items-center gap-1">
          <SidebarTrigger className="size-7" />
          <Button
            variant="ghost"
            size="icon"
            className="size-7 sm:hidden"
            onClick={() => setIsPanelVisible(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      <div className="p-2 border-b space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar eleitores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn("pl-8 h-9", searchQuery && "pr-8")}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 size-7"
                onClick={() => setSearchQuery("")}
              >
                <X className="size-3.5" />
              </Button>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="size-9 shrink-0">
                <Filter className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 max-h-[500px] overflow-y-auto"
            >
              <DropdownMenuLabel>Nível de Apoio</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setSupportLevelFilter("all")}
                className="gap-2"
              >
                <span className="flex-1">Todos os níveis</span>
                {supportLevelFilter === "all" && <Check className="size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSupportLevelFilter("MUITO_FAVORAVEL")}
                className="gap-2"
              >
                <div
                  className="size-3 rounded-full"
                  style={{
                    backgroundColor: SUPPORT_LEVEL_COLORS.MUITO_FAVORAVEL,
                  }}
                />
                <span className="flex-1">Muito Favorável</span>
                {supportLevelFilter === "MUITO_FAVORAVEL" && (
                  <Check className="size-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSupportLevelFilter("FAVORAVEL")}
                className="gap-2"
              >
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: SUPPORT_LEVEL_COLORS.FAVORAVEL }}
                />
                <span className="flex-1">Favorável</span>
                {supportLevelFilter === "FAVORAVEL" && (
                  <Check className="size-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSupportLevelFilter("NEUTRO")}
                className="gap-2"
              >
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: SUPPORT_LEVEL_COLORS.NEUTRO }}
                />
                <span className="flex-1">Neutro</span>
                {supportLevelFilter === "NEUTRO" && (
                  <Check className="size-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSupportLevelFilter("DESFAVORAVEL")}
                className="gap-2"
              >
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: SUPPORT_LEVEL_COLORS.DESFAVORAVEL }}
                />
                <span className="flex-1">Desfavorável</span>
                {supportLevelFilter === "DESFAVORAVEL" && (
                  <Check className="size-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSupportLevelFilter("MUITO_DESFAVORAVEL")}
                className="gap-2"
              >
                <div
                  className="size-3 rounded-full"
                  style={{
                    backgroundColor: SUPPORT_LEVEL_COLORS.MUITO_DESFAVORAVEL,
                  }}
                />
                <span className="flex-1">Muito Desfavorável</span>
                {supportLevelFilter === "MUITO_DESFAVORAVEL" && (
                  <Check className="size-4" />
                )}
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Estados</DropdownMenuLabel>
              {uniqueStates.map((state) => (
                <DropdownMenuItem
                  key={state}
                  onClick={() => {
                    setSelectedStates((prev) =>
                      prev.includes(state)
                        ? prev.filter((s) => s !== state)
                        : [...prev, state]
                    );
                  }}
                  className="gap-2"
                >
                  <span className="flex-1">{state}</span>
                  {selectedStates.includes(state) && (
                    <Check className="size-4" />
                  )}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Cidades</DropdownMenuLabel>
              {uniqueCities.slice(0, 10).map((city) => (
                <DropdownMenuItem
                  key={city}
                  onClick={() => {
                    setSelectedCities((prev) =>
                      prev.includes(city)
                        ? prev.filter((c) => c !== city)
                        : [...prev, city]
                    );
                  }}
                  className="gap-2"
                >
                  <span className="flex-1 truncate">{city}</span>
                  {selectedCities.includes(city) && (
                    <Check className="size-4" />
                  )}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Tags</DropdownMenuLabel>
              {uniqueTags.slice(0, 10).map((tag) => (
                <DropdownMenuItem
                  key={tag}
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className="gap-2"
                >
                  <span className="flex-1 truncate">{tag}</span>
                  {selectedTags.includes(tag) && <Check className="size-4" />}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Outros Filtros</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setHasLocationFilter(!hasLocationFilter)}
                className="gap-2"
              >
                <MapPin className="size-4" />
                <span className="flex-1">Com localização</span>
                {hasLocationFilter && <Check className="size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setHasWhatsAppFilter(!hasWhatsAppFilter)}
                className="gap-2"
              >
                <Phone className="size-4" />
                <span className="flex-1">Com WhatsApp</span>
                {hasWhatsAppFilter && <Check className="size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setHasEmailFilter(!hasEmailFilter)}
                className="gap-2"
              >
                <Mail className="size-4" />
                <span className="flex-1">Com Email</span>
                {hasEmailFilter && <Check className="size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setHasPhoneFilter(!hasPhoneFilter)}
                className="gap-2"
              >
                <Phone className="size-4" />
                <span className="flex-1">Com Telefone</span>
                {hasPhoneFilter && <Check className="size-4" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Active filters */}
        {(supportLevelFilter !== "all" ||
          hasLocationFilter ||
          hasWhatsAppFilter ||
          hasEmailFilter ||
          hasPhoneFilter ||
          selectedCities.length > 0 ||
          selectedStates.length > 0 ||
          selectedTags.length > 0) && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Filtros ativos
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => {
                  setSupportLevelFilter("all");
                  setHasLocationFilter(false);
                  setHasWhatsAppFilter(false);
                  setHasEmailFilter(false);
                  setHasPhoneFilter(false);
                  setSelectedCities([]);
                  setSelectedStates([]);
                  setSelectedTags([]);
                }}
              >
                Limpar tudo
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {supportLevelFilter !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  {SUPPORT_LEVEL_LABELS[supportLevelFilter]} apoio
                  <button
                    onClick={() => setSupportLevelFilter("all")}
                    className="ml-1 hover:bg-background rounded-full"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              )}
              {selectedStates.map((state) => (
                <Badge key={state} variant="secondary" className="text-xs">
                  {state}
                  <button
                    onClick={() =>
                      setSelectedStates((prev) =>
                        prev.filter((s) => s !== state)
                      )
                    }
                    className="ml-1 hover:bg-background rounded-full"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
              {selectedCities.map((city) => (
                <Badge key={city} variant="secondary" className="text-xs">
                  {city}
                  <button
                    onClick={() =>
                      setSelectedCities((prev) =>
                        prev.filter((c) => c !== city)
                      )
                    }
                    className="ml-1 hover:bg-background rounded-full"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                  <button
                    onClick={() =>
                      setSelectedTags((prev) => prev.filter((t) => t !== tag))
                    }
                    className="ml-1 hover:bg-background rounded-full"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
              {hasLocationFilter && (
                <Badge variant="secondary" className="text-xs">
                  Com localização
                  <button
                    onClick={() => setHasLocationFilter(false)}
                    className="ml-1 hover:bg-background rounded-full"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              )}
              {hasWhatsAppFilter && (
                <Badge variant="secondary" className="text-xs">
                  Com WhatsApp
                  <button
                    onClick={() => setHasWhatsAppFilter(false)}
                    className="ml-1 hover:bg-background rounded-full"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              )}
              {hasEmailFilter && (
                <Badge variant="secondary" className="text-xs">
                  Com Email
                  <button
                    onClick={() => setHasEmailFilter(false)}
                    className="ml-1 hover:bg-background rounded-full"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              )}
              {hasPhoneFilter && (
                <Badge variant="secondary" className="text-xs">
                  Com Telefone
                  <button
                    onClick={() => setHasPhoneFilter(false)}
                    className="ml-1 hover:bg-background rounded-full"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-2">
          {filteredVoters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="size-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Nenhum eleitor encontrado</p>
              <p className="text-xs text-muted-foreground mt-1">
                Tente ajustar os filtros de busca
              </p>
            </div>
          ) : (
            filteredVoters.map((voter) => {
              const isSelected = selectedVoterId === voter.id;
              const hasLocation = voter.latitude && voter.longitude;

              if (isSelected) {
                return (
                  <div
                    key={voter.id}
                    className={cn(
                      "flex flex-col rounded-lg border-2 overflow-hidden",
                      "border-primary bg-accent/30"
                    )}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Users className="size-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-base">
                                {voter.name}
                              </h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {voter.city}, {voter.state}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0"
                          onClick={handleClose}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>

                      {voter.supportLevel && (
                        <div className="mb-3">
                          <Badge
                            className="text-xs"
                            style={{
                              backgroundColor: `${
                                SUPPORT_LEVEL_COLORS[voter.supportLevel]
                              }20`,
                              color: SUPPORT_LEVEL_COLORS[voter.supportLevel],
                            }}
                          >
                            {SUPPORT_LEVEL_LABELS[voter.supportLevel]} Apoio
                          </Badge>
                        </div>
                      )}

                      <div className="space-y-2 mb-4">
                        {voter.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="size-4 text-muted-foreground" />
                            <span>{voter.phone}</span>
                            {voter.hasWhatsapp && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] h-5"
                              >
                                WhatsApp
                              </Badge>
                            )}
                          </div>
                        )}
                        {voter.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="size-4 text-muted-foreground" />
                            <span className="truncate">{voter.email}</span>
                          </div>
                        )}
                        {voter.electoralZone && voter.electoralSection && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            Zona {voter.electoralZone}, Seção{" "}
                            {voter.electoralSection}
                          </div>
                        )}
                        {voter.address && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="size-4" />
                            <span className="truncate">{voter.address}</span>
                          </div>
                        )}
                      </div>

                      {(() => {
                        const tags = getTags(voter);
                        return tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        );
                      })()}

                      {voter.notes && (
                        <div className="mt-3 p-2 bg-muted/50 rounded text-sm">
                          {voter.notes}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={voter.id}
                  className={cn(
                    "group flex flex-col gap-2 rounded-lg border p-3 transition-colors",
                    hasLocation
                      ? "cursor-pointer hover:bg-accent/50"
                      : "opacity-60"
                  )}
                  onClick={() => hasLocation && handleVoterClick(voter)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="size-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm truncate">
                          {voter.name}
                        </h3>
                        {!hasLocation && (
                          <Badge variant="outline" className="text-[10px] h-5">
                            Sem localização
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {voter.city}, {voter.state}
                      </p>
                    </div>
                    {voter.supportLevel && (
                      <div
                        className="size-3 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            SUPPORT_LEVEL_COLORS[voter.supportLevel],
                        }}
                        title={`${
                          SUPPORT_LEVEL_LABELS[voter.supportLevel]
                        } Apoio`}
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {voter.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="size-3" />
                          {voter.hasWhatsapp && (
                            <span className="text-green-600">✓</span>
                          )}
                        </div>
                      )}
                      {voter.email && <Mail className="size-3" />}
                      {voter.electoralZone && voter.electoralSection && (
                        <span>
                          Z{voter.electoralZone} S{voter.electoralSection}
                        </span>
                      )}
                    </div>
                  </div>

                  {(() => {
                    const tags = getTags(voter);
                    return tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-[10px] h-5"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {tags.length > 2 && (
                          <Badge variant="outline" className="text-[10px] h-5">
                            +{tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    );
                  })()}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
