"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  MapPin,
  Edit2,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Pencil,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Geofence } from "@/types/geofence";
import { cn } from "@/lib/utils";

interface GeofencePanelProps {
  geofences: Geofence[];
  selectedGeofenceId: string | null;
  onGeofenceSelect: (id: string | null) => void;
  onGeofenceToggle: (id: string) => void;
  onGeofenceDelete: (id: string) => void;
  onDrawMode: () => void;
  isDrawing: boolean;
  filteredVotersCount: number;
}

export function GeofencePanel({
  geofences,
  selectedGeofenceId,
  onGeofenceSelect,
  onGeofenceToggle,
  onGeofenceDelete,
  onDrawMode,
  isDrawing,
  filteredVotersCount,
}: GeofencePanelProps) {
  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(true);

  const filtered = geofences.filter((g) => {
    if (!showInactive && !g.active) return false;
    if (search && !g.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const activeCount = geofences.filter((g) => g.active).length;
  const selectedGeofence = geofences.find((g) => g.id === selectedGeofenceId);

  return (
    <>
      {/* Main Panel */}
      <div className="absolute left-4 top-4 z-10 w-80 bg-background rounded-lg shadow-xl border">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Geofences</CardTitle>
                <CardDescription>Gerencie cercas virtuais</CardDescription>
              </div>
              <Button
                size="sm"
                onClick={onDrawMode}
                variant={isDrawing ? "default" : "outline"}
              >
                <Pencil className="size-4 mr-1" />
                {isDrawing ? "Desenhando..." : "Desenhar"}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border p-2 text-center">
                <p className="text-2xl font-bold">{activeCount}</p>
                <p className="text-xs text-muted-foreground">Ativas</p>
              </div>
              <div className="rounded-lg border p-2 text-center">
                <p className="text-2xl font-bold">{filteredVotersCount}</p>
                <p className="text-xs text-muted-foreground">Eleitores</p>
              </div>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <Input
                placeholder="Buscar geofence..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9"
              />
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-inactive"
                  checked={showInactive}
                  onCheckedChange={setShowInactive}
                />
                <Label
                  htmlFor="show-inactive"
                  className="text-sm cursor-pointer"
                >
                  Mostrar inativas
                </Label>
              </div>
            </div>

            {/* List */}
            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="space-y-2">
                {filtered.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Nenhuma geofence encontrada
                  </div>
                ) : (
                  filtered.map((geofence) => (
                    <div
                      key={geofence.id}
                      onClick={() =>
                        onGeofenceSelect(
                          selectedGeofenceId === geofence.id
                            ? null
                            : geofence.id
                        )
                      }
                      className={cn(
                        "w-full rounded-lg border p-3 text-left transition-colors hover:bg-accent cursor-pointer",
                        selectedGeofenceId === geofence.id && "bg-accent"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <div
                            className="size-4 rounded-full mt-0.5 shrink-0"
                            style={{ backgroundColor: geofence.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {geofence.name}
                            </p>
                            {geofence.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {geofence.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {geofence.type === "polygon"
                                  ? "Polígono"
                                  : "Círculo"}
                              </Badge>
                              {geofence.active ? (
                                <CheckCircle2 className="size-3 text-green-500" />
                              ) : (
                                <Circle className="size-3 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              onGeofenceToggle(geofence.id);
                            }}
                          >
                            {geofence.active ? (
                              <Eye className="size-3" />
                            ) : (
                              <EyeOff className="size-3" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7 text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              onGeofenceDelete(geofence.id);
                            }}
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Details Drawer */}
      {selectedGeofence && (
        <Drawer
          open={!!selectedGeofenceId}
          onOpenChange={() => onGeofenceSelect(null)}
        >
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle className="flex items-center gap-2">
                  <div
                    className="size-4 rounded-full"
                    style={{ backgroundColor: selectedGeofence.color }}
                  />
                  {selectedGeofence.name}
                </DrawerTitle>
                <DrawerDescription>
                  {selectedGeofence.description}
                </DrawerDescription>
              </DrawerHeader>

              <div className="p-4 space-y-4">
                {/* Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Tipo</p>
                    <p className="text-sm font-medium">
                      {selectedGeofence.type === "polygon"
                        ? "Polígono"
                        : "Círculo"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge
                      variant={
                        selectedGeofence.active ? "default" : "secondary"
                      }
                    >
                      {selectedGeofence.active ? "Ativa" : "Inativa"}
                    </Badge>
                  </div>
                  {selectedGeofence.type === "circle" &&
                    selectedGeofence.radius && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Raio</p>
                        <p className="text-sm font-medium">
                          {selectedGeofence.radius}m
                        </p>
                      </div>
                    )}
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Criado em</p>
                    <p className="text-sm font-medium">
                      {new Date(selectedGeofence.createdAt).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => onGeofenceToggle(selectedGeofence.id)}
                  >
                    {selectedGeofence.active ? (
                      <>
                        <EyeOff className="size-4 mr-2" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <Eye className="size-4 mr-2" />
                        Ativar
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      onGeofenceDelete(selectedGeofence.id);
                      onGeofenceSelect(null);
                    }}
                  >
                    <Trash2 className="size-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </div>

              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Fechar</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
