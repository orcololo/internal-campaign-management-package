"use client";

import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, MapPin, Users, Video, Tag, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/calendar";

interface DayDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  date: Date | null;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onCreateEvent: () => void;
}

const categoryColors: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  meeting: { bg: "bg-blue-500", text: "text-blue-500", label: "Reunião" },
  rally: { bg: "bg-red-500", text: "text-red-500", label: "Comício" },
  "door-to-door": {
    bg: "bg-purple-500",
    text: "text-purple-500",
    label: "Corpo a Corpo",
  },
  "phone-bank": {
    bg: "bg-green-500",
    text: "text-green-500",
    label: "Ligações",
  },
  fundraiser: {
    bg: "bg-orange-500",
    text: "text-orange-500",
    label: "Arrecadação",
  },
  debate: { bg: "bg-pink-500", text: "text-pink-500", label: "Debate" },
  media: { bg: "bg-yellow-500", text: "text-yellow-500", label: "Mídia" },
  volunteer: { bg: "bg-cyan-500", text: "text-cyan-500", label: "Voluntários" },
  training: {
    bg: "bg-indigo-500",
    text: "text-indigo-500",
    label: "Treinamento",
  },
  other: { bg: "bg-gray-500", text: "text-gray-500", label: "Outros" },
};

const priorityColors: Record<string, { bg: string; label: string }> = {
  low: { bg: "bg-gray-500", label: "Baixa" },
  medium: { bg: "bg-blue-500", label: "Média" },
  high: { bg: "bg-orange-500", label: "Alta" },
  urgent: { bg: "bg-red-500", label: "Urgente" },
};

const statusColors: Record<string, { bg: string; label: string }> = {
  scheduled: { bg: "bg-blue-500", label: "Agendado" },
  "in-progress": { bg: "bg-yellow-500", label: "Em Andamento" },
  completed: { bg: "bg-green-500", label: "Concluído" },
  cancelled: { bg: "bg-gray-500", label: "Cancelado" },
};

export function DayDetailsDialog({
  open,
  onClose,
  date,
  events,
  onEventClick,
  onCreateEvent,
}: DayDetailsDialogProps) {
  if (!date) return null;

  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Calendar className="size-6" />
            {format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </DialogTitle>
          <DialogDescription>
            {events.length === 0
              ? "Nenhum evento neste dia"
              : `${events.length} ${
                  events.length === 1 ? "evento" : "eventos"
                }`}
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <ScrollArea
          className="flex-1 px-6 py-4"
          style={{ maxHeight: "calc(85vh - 180px)" }}
        >
          {sortedEvents.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar className="size-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Dia livre</p>
              <p className="text-sm text-muted-foreground mb-6">
                Não há eventos agendados para este dia
              </p>
              <Button onClick={onCreateEvent}>
                <Calendar className="size-4 mr-2" />
                Criar Evento
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedEvents.map((event) => {
                const category =
                  categoryColors[event.category] || categoryColors.other;
                const priority = priorityColors[event.priority];
                const status = statusColors[event.status];

                return (
                  <Card
                    key={event.id}
                    className="p-4 hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => {
                      onClose();
                      onEventClick(event);
                    }}
                  >
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={cn("size-3 rounded-full", category.bg)}
                            />
                            <h3 className="font-semibold text-lg truncate">
                              {event.title}
                            </h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge
                              variant="outline"
                              className={cn("text-xs", category.text)}
                            >
                              {category.label}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={cn("text-xs text-white", priority.bg)}
                            >
                              {priority.label}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={cn("text-xs text-white", status.bg)}
                            >
                              {status.label}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="size-4" />
                        {event.allDay ? (
                          <span>Dia inteiro</span>
                        ) : (
                          <span>
                            {format(new Date(event.startDate), "HH:mm", {
                              locale: ptBR,
                            })}{" "}
                            -{" "}
                            {format(new Date(event.endDate), "HH:mm", {
                              locale: ptBR,
                            })}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {event.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {event.description}
                        </p>
                      )}

                      {/* Location */}
                      {event.isVirtual ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Video className="size-4" />
                          <span>Evento virtual</span>
                        </div>
                      ) : event.location?.address ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="size-4" />
                          <span className="truncate">
                            {event.location.address}
                          </span>
                        </div>
                      ) : null}

                      {/* Expected Attendance */}
                      {event.expectedAttendance && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="size-4" />
                          <span>
                            {event.expectedAttendance} participantes esperados
                          </span>
                        </div>
                      )}

                      {/* Tags */}
                      {event.tags && event.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Tag className="size-4 text-muted-foreground" />
                          {event.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {event.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{event.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <Separator />

        <div className="p-6 pt-4 flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={onCreateEvent}>
            <Calendar className="size-4 mr-2" />
            Novo Evento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
