"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSetting } from "@/hooks/use-setting";
import { Skeleton } from "@/components/ui/skeleton";

export function NotificationSettings() {
  const { value: emailEnabled, save: saveEmail, loading: loadingEmail } = useSetting("notifications.email", true);
  const { value: pushEnabled, save: savePush, loading: loadingPush } = useSetting("notifications.push", false);

  if (loadingEmail || loadingPush) {
    return <div className="space-y-4"><Skeleton className="h-[200px] w-full" /></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificações</CardTitle>
        <CardDescription>
          Gerencie como você recebe alertas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
            <span>Notificações por Email</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Receba resumos diários e alertas importantes por email.
            </span>
          </Label>
          <Switch
            id="email-notifications"
            checked={emailEnabled}
            onCheckedChange={saveEmail}
          />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
            <span>Notificações Push</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Receba alertas em tempo real no seu navegador.
            </span>
          </Label>
          <Switch
            id="push-notifications"
            checked={pushEnabled}
            onCheckedChange={savePush}
          />
        </div>
      </CardContent>
    </Card>
  );
}
