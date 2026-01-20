"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GeneralSettings } from "@/components/features/settings/general-settings";
import { MapSettings } from "@/components/features/settings/map-settings";
import { NotificationSettings } from "@/components/features/settings/notification-settings";
import { AppearanceSettings } from "@/components/features/settings/appearance-settings";

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
      </div>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="map">Mapas</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <GeneralSettings />
        </TabsContent>
        <TabsContent value="map" className="space-y-4">
          <MapSettings />
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <NotificationSettings />
        </TabsContent>
        <TabsContent value="appearance" className="space-y-4">
          <AppearanceSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
