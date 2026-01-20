"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    Bell,
    Check,
    CheckCheck,
    X,
    Calendar,
    MessageSquare,
    AlertCircle,
    Upload,
    Download,
    Megaphone,
    ClipboardList,
    Wifi,
    WifiOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNotifications } from "@/hooks/use-notifications";
import { Notification, NotificationType } from "@/lib/api/notifications";

const TYPE_CONFIG: Record<
    NotificationType,
    { icon: typeof Bell; color: string; label: string }
> = {
    event_reminder: { icon: Calendar, color: "text-blue-500", label: "Lembrete" },
    task_assigned: { icon: ClipboardList, color: "text-yellow-500", label: "Tarefa" },
    campaign_complete: { icon: Megaphone, color: "text-green-500", label: "Campanha" },
    campaign_started: { icon: Megaphone, color: "text-purple-500", label: "Campanha" },
    message_response: { icon: MessageSquare, color: "text-cyan-500", label: "Mensagem" },
    import_complete: { icon: Upload, color: "text-orange-500", label: "Importação" },
    export_complete: { icon: Download, color: "text-indigo-500", label: "Exportação" },
    system: { icon: Bell, color: "text-gray-500", label: "Sistema" },
    error: { icon: AlertCircle, color: "text-red-500", label: "Erro" },
};

export function NotificationsBell() {
    const [open, setOpen] = useState(false);
    const {
        notifications,
        unreadCount,
        loading,
        connected,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    } = useNotifications();

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
        if (notification.link) {
            window.location.href = notification.link;
        }
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-500">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold">Notificações</h4>
                        {connected ? (
                            <Wifi className="h-3 w-3 text-green-500" />
                        ) : (
                            <WifiOff className="h-3 w-3 text-red-500" />
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            onClick={() => markAllAsRead()}
                        >
                            <CheckCheck className="h-3 w-3 mr-1" />
                            Marcar todas
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-80">
                    {loading ? (
                        <div className="p-4 text-center text-muted-foreground">
                            Carregando...
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>Nenhuma notificação</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.slice(0, 20).map((notification) => {
                                const config = TYPE_CONFIG[notification.type];
                                const Icon = config.icon;

                                return (
                                    <div
                                        key={notification.id}
                                        className={`p-3 hover:bg-muted/50 transition-colors cursor-pointer relative group ${!notification.read ? "bg-muted/30" : ""
                                            }`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`mt-0.5 ${config.color}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-sm truncate">
                                                        {notification.title}
                                                    </p>
                                                    {!notification.read && (
                                                        <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                                                    )}
                                                </div>
                                                {notification.message && (
                                                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                                        {notification.message}
                                                    </p>
                                                )}
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {formatDistanceToNow(new Date(notification.createdAt), {
                                                        addSuffix: true,
                                                        locale: ptBR,
                                                    })}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNotification(notification.id);
                                                }}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>

                {notifications.length > 20 && (
                    <>
                        <Separator />
                        <div className="p-2">
                            <Button variant="ghost" size="sm" className="w-full text-xs">
                                Ver todas ({notifications.length})
                            </Button>
                        </div>
                    </>
                )}
            </PopoverContent>
        </Popover>
    );
}
