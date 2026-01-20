"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useSetting } from "@/hooks/use-setting";
import { Skeleton } from "@/components/ui/skeleton";

export function MapSettings() {
  const { value: defaultZoom, save: saveZoom, loading: loadingZoom } = useSetting("map.defaultZoom", 12);
  const { value: mapStyle, save: saveStyle, loading: loadingStyle } = useSetting("map.style", "osm");

  if (loadingZoom || loadingStyle) {
    return <div className="space-y-4"><Skeleton className="h-[200px] w-full" /></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapas</CardTitle>
        <CardDescription>
          Preferências de visualização dos mapas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Zoom Inicial</Label>
            <span className="text-sm text-muted-foreground">{defaultZoom}</span>
          </div>
          <Slider
            min={1}
            max={20}
            step={1}
            value={[defaultZoom]}
            onValueChange={([val]) => saveZoom(val)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Estilo do Mapa</Label>
          <Select value={mapStyle} onValueChange={saveStyle}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="osm">OpenStreetMap (Padrão)</SelectItem>
              <SelectItem value="satellite">Satélite (Indisponível)</SelectItem>
              <SelectItem value="dark">Modo Escuro (Indisponível)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
