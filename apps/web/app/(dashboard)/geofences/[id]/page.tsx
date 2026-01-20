"use client";

import { use, useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VotersTable } from "@/components/features/voters/voters-table";
import { useVotersStore } from "@/store/voters-store";
import { geofencesApi } from "@/lib/api/geofences";
import { isPointInPolygon } from "@/lib/geo-utils";
import { Geofence } from "@/types/geofence";
import { showToast } from "@/lib/toast";
import { ArrowLeft, MapPin, Users, TrendingUp } from "lucide-react";
import { notFound } from "next/navigation";

interface GeofenceDetailPageProps {
  params: Promise<{ id: string }>;
}

function transformGeofence(backendGeofence: any): Geofence {
  let coordinates: number[][][] = [];

  if (backendGeofence.type === 'POLYGON' && backendGeofence.polygon) {
    const ring = backendGeofence.polygon.map((p: any) => [parseFloat(p.lng), parseFloat(p.lat)]);
    if (ring.length > 0) {
        const first = ring[0];
        const last = ring[ring.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
            ring.push(first);
        }
    }
    coordinates = [ring];
  }

  return {
    id: backendGeofence.id,
    name: backendGeofence.name,
    description: backendGeofence.description || "",
    type: backendGeofence.type?.toLowerCase() || "polygon",
    coordinates,
    radius: backendGeofence.radiusKm ? backendGeofence.radiusKm * 1000 : undefined,
    color: backendGeofence.color || "#3b82f6",
    fillOpacity: 0.2,
    strokeOpacity: 0.8,
    active: !backendGeofence.deletedAt,
    createdAt: new Date(backendGeofence.createdAt),
    updatedAt: new Date(backendGeofence.updatedAt),
  };
}

export default function GeofenceDetailPage({
  params,
}: GeofenceDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { voters, fetchVoters } = useVotersStore();
  const [geofence, setGeofence] = useState<Geofence | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVoters({ page: 1, perPage: 1000 });
  }, [fetchVoters]);

  useEffect(() => {
    const loadGeofence = async () => {
      try {
        setIsLoading(true);
        const data = await geofencesApi.getById(id);
        if (data) {
          setGeofence(transformGeofence(data));
        } else {
          showToast.error("Geofence não encontrada");
        }
      } catch (error) {
        console.error("Failed to load geofence:", error);
        showToast.error("Erro ao carregar geofence");
      } finally {
        setIsLoading(false);
      }
    };
    loadGeofence();
  }, [id]);

  const filteredVoters = useMemo(() => {
    if (!geofence) return [];

    return voters.filter((voter) => {
      if (!voter.latitude || !voter.longitude) return false;

      if (geofence.type === "polygon") {
        return isPointInPolygon(
          [voter.longitude as number, voter.latitude as number],
          geofence.coordinates as number[][][]
        );
      }
      return false;
    });
  }, [geofence, voters]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <p className="text-muted-foreground">Carregando detalhes da geofence...</p>
      </div>
    );
  }

  if (!geofence) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
          <p className="text-muted-foreground">Geofence não encontrada</p>
          <Button onClick={() => router.back()}>Voltar</Button>
        </div>
      );
  }

  // Calculate stats
  const voterCount = filteredVoters.length;
  const supportLevels = filteredVoters.reduce((acc, v) => {
    const level = v.supportLevel || "NAO_DEFINIDO";
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const favorableCount =
    (supportLevels.MUITO_FAVORAVEL || 0) + (supportLevels.FAVORAVEL || 0);
  const neutralCount = supportLevels.NEUTRO || 0;
  const unfavorableCount =
    (supportLevels.DESFAVORAVEL || 0) + (supportLevels.MUITO_DESFAVORAVEL || 0);

  const averageAge =
    filteredVoters.reduce((sum, v) => {
      if (!v.dateOfBirth) return sum;
      const age =
        new Date().getFullYear() - new Date(v.dateOfBirth).getFullYear();
      return sum + age;
    }, 0) / (filteredVoters.filter((v) => v.dateOfBirth).length || 1);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div
              className="size-4 rounded-full"
              style={{ backgroundColor: geofence.color }}
            />
            <h1 className="text-3xl font-bold tracking-tight">
              {geofence.name}
            </h1>
            <Badge variant={geofence.active ? "default" : "secondary"}>
              {geofence.active ? "Ativa" : "Inativa"}
            </Badge>
          </div>
          {geofence.description && (
            <p className="text-muted-foreground mt-1">{geofence.description}</p>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Eleitores
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{voterCount}</div>
            <p className="text-xs text-muted-foreground">Dentro da geofence</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favoráveis</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {favorableCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {voterCount > 0
                ? ((favorableCount / voterCount) * 100).toFixed(1)
                : 0}
              % do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Neutros</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {neutralCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {voterCount > 0
                ? ((neutralCount / voterCount) * 100).toFixed(1)
                : 0}
              % do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Desfavoráveis</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground rotate-180" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {unfavorableCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {voterCount > 0
                ? ((unfavorableCount / voterCount) * 100).toFixed(1)
                : 0}
              % do total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Geofence Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Geofence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Tipo</p>
              <p className="text-lg font-medium">
                {geofence.type === "polygon" ? "Polígono" : "Círculo"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Criado em</p>
              <p className="text-lg font-medium">
                {new Date(geofence.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Idade Média</p>
              <p className="text-lg font-medium">
                {Math.round(averageAge) || 0} anos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voters Table */}
      <Card>
        <CardHeader>
          <CardTitle>Eleitores na Geofence</CardTitle>
          <CardDescription>
            Lista completa de eleitores dentro da área delimitada
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredVoters.length > 0 ? (
            <VotersTable data={filteredVoters} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MapPin className="size-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">
                Nenhum eleitor encontrado
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Não há eleitores cadastrados dentro desta geofence
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
