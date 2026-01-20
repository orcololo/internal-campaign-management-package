"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSetting } from "@/hooks/use-setting";
import { Skeleton } from "@/components/ui/skeleton";

export function GeneralSettings() {
  const { value: campaignName, save: saveName, loading: loadingName } = useSetting("general.campaignName", "Minha Campanha");
  const { value: city, save: saveCity, loading: loadingCity } = useSetting("general.defaultCity", "São Paulo");
  const { value: state, save: saveState, loading: loadingState } = useSetting("general.defaultState", "SP");

  if (loadingName || loadingCity || loadingState) {
    return <div className="space-y-4"><Skeleton className="h-[200px] w-full" /></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geral</CardTitle>
        <CardDescription>
          Configurações básicas da sua campanha.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name">Nome da Campanha</Label>
          <Input
            id="name"
            value={campaignName}
            onChange={(e) => saveName(e.target.value)}
            // Note: Debouncing would be better here for real-time saving
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="city">Cidade Padrão</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => saveCity(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="state">Estado Padrão</Label>
            <Input
              id="state"
              value={state}
              onChange={(e) => saveState(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
