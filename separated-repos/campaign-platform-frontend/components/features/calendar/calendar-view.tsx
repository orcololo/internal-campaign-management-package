"use client";

import * as React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/calendar";

interface CalendarViewProps {
  events: CalendarEvent[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onDayClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

const categoryColors: Record<string, string> = {
  meeting: "bg-blue-500",
  rally: "bg-red-500",
  "door-to-door": "bg-purple-500",
  "phone-bank": "bg-green-500",
  fundraiser: "bg-orange-500",
  debate: "bg-pink-500",
  media: "bg-yellow-500",
  volunteer: "bg-cyan-500",
  training: "bg-indigo-500",
  other: "bg-gray-500",
};

export function CalendarView({
  events,
  currentDate,
  onDateChange,
  onDayClick,
  onEventClick,
  onPrevious,
  onNext,
  onToday,
}: CalendarViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (day: Date): CalendarEvent[] => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, day);
    });
  };

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">
            {format(currentDate, "MMMM yyyy", { locale: ptBR })}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onToday}>
            <CalendarIcon className="size-4 mr-2" />
            Hoje
          </Button>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={onPrevious}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={onNext}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="p-4">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-muted-foreground p-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);

            return (
              <button
                key={day.toString()}
                onClick={() => onDayClick(day)}
                className={cn(
                  "min-h-24 p-2 rounded-lg border-2 transition-colors text-left",
                  "hover:border-primary/50",
                  isCurrentMonth ? "bg-background" : "bg-muted/30",
                  isCurrentDay && "border-primary bg-primary/5"
                )}
              >
                <div
                  className={cn(
                    "text-sm font-medium mb-1",
                    !isCurrentMonth && "text-muted-foreground",
                    isCurrentDay && "text-primary font-bold"
                  )}
                >
                  {format(day, "d")}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className={cn(
                        "text-xs p-1 rounded truncate cursor-pointer",
                        categoryColors[event.category] || "bg-gray-500",
                        "text-white hover:opacity-80"
                      )}
                      title={event.title}
                    >
                      {format(new Date(event.startDate), "HH:mm")} {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground px-1">
                      +{dayEvents.length - 3} mais
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        {Object.entries({
          meeting: "Reunião",
          rally: "Comício",
          "door-to-door": "Corpo a Corpo",
          "phone-bank": "Ligações",
          fundraiser: "Arrecadação",
          debate: "Debate",
          media: "Mídia",
          volunteer: "Voluntários",
          training: "Treinamento",
          other: "Outros",
        }).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={cn("size-3 rounded", categoryColors[key])} />
            <span className="text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface EventListViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function EventListView({ events, onEventClick }: EventListViewProps) {
  // Group events by date
  const groupedEvents = events.reduce((acc, event) => {
    const date = format(new Date(event.startDate), "yyyy-MM-dd");
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  const sortedDates = Object.keys(groupedEvents).sort();

  if (events.length === 0) {
    return (
      <Card className="p-12 text-center">
        <CalendarIcon className="size-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">Nenhum evento encontrado</p>
        <p className="text-sm text-muted-foreground">
          Crie um novo evento para começar
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => {
        const dayEvents = groupedEvents[date];
        const dateObj = new Date(date);

        return (
          <div key={date}>
            <h3 className="text-lg font-semibold mb-3">
              {format(dateObj, "EEEE, d 'de' MMMM", { locale: ptBR })}
              {isToday(dateObj) && (
                <Badge variant="secondary" className="ml-2">
                  Hoje
                </Badge>
              )}
            </h3>
            <div className="space-y-2">
              {dayEvents.map((event) => (
                <Card
                  key={event.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onEventClick(event)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "size-12 rounded-lg flex items-center justify-center shrink-0",
                        categoryColors[event.category] || "bg-gray-500"
                      )}
                    >
                      <Clock className="size-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold">{event.title}</h4>
                        <Badge
                          variant={
                            event.status === "completed"
                              ? "secondary"
                              : event.status === "in-progress"
                              ? "default"
                              : event.status === "cancelled"
                              ? "destructive"
                              : "outline"
                          }
                          className="shrink-0"
                        >
                          {event.status === "scheduled" && "Agendado"}
                          {event.status === "in-progress" && "Em Andamento"}
                          {event.status === "completed" && "Concluído"}
                          {event.status === "cancelled" && "Cancelado"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Clock className="size-4" />
                          {format(new Date(event.startDate), "HH:mm")} -{" "}
                          {format(new Date(event.endDate), "HH:mm")}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="size-4" />
                            {event.location.city}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="size-4" />
                          {event.attendees.length} participantes
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
