"use client";

import * as React from "react";
import { Plus, Calendar as CalendarIcon, List, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  CalendarView,
  EventListView,
} from "@/components/features/calendar/calendar-view";
import { EventFormDialog } from "@/components/features/calendar/event-form-dialog";
import { DayDetailsDialog } from "@/components/features/calendar/day-details-dialog";
import { useCalendarStore } from "@/store/calendar-store";
import type {
  EventCategory,
  EventStatus,
  EventPriority,
} from "@/types/calendar";

export default function CalendarPage() {
  const [selectedDay, setSelectedDay] = React.useState<Date | null>(null);
  const [isDayDialogOpen, setIsDayDialogOpen] = React.useState(false);

  const {
    events,
    currentDate,
    view,
    filters,
    stats,
    isLoading,
    selectedEvent,
    isEventDialogOpen,
    isEditMode,
    fetchEventsByMonth,
    fetchStats,
    setCurrentDate,
    setView,
    setFilters,
    clearFilters,
    openEventDialog,
    closeEventDialog,
    createEvent,
    updateEvent,
    deleteEvent,
    goToToday,
    goToPrevious,
    goToNext,
  } = useCalendarStore();

  // Fetch events when component mounts or month changes
  React.useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    fetchEventsByMonth(year, month);
    fetchStats();
  }, [currentDate, fetchEventsByMonth, fetchStats]);

  // Filter events based on active filters
  const filteredEvents = React.useMemo(() => {
    return events.filter((event) => {
      if (
        filters.category &&
        filters.category.length > 0 &&
        !filters.category.includes(event.category)
      ) {
        return false;
      }
      if (
        filters.status &&
        filters.status.length > 0 &&
        !filters.status.includes(event.status)
      ) {
        return false;
      }
      if (
        filters.priority &&
        filters.priority.length > 0 &&
        !filters.priority.includes(event.priority)
      ) {
        return false;
      }
      return true;
    });
  }, [events, filters]);

  const handleEventSubmit = async (data: any) => {
    if (isEditMode && selectedEvent) {
      await updateEvent(selectedEvent.id, data);
    } else {
      await createEvent(data);
    }
  };

  const handleDayClick = (date: Date) => {
    setSelectedDay(date);
    setIsDayDialogOpen(true);
  };

  const handleCloseDayDialog = () => {
    setIsDayDialogOpen(false);
    setSelectedDay(null);
  };

  const getDayEvents = (date: Date | null) => {
    if (!date) return [];
    return filteredEvents.filter((event) => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  };

  const activeFilterCount =
    (filters.category?.length || 0) +
    (filters.status?.length || 0) +
    (filters.priority?.length || 0);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendário</h1>
          <p className="text-muted-foreground">
            Gerencie os eventos da sua campanha
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => openEventDialog()}>
            <Plus className="size-4 mr-2" />
            Novo Evento
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Hoje</div>
            <div className="text-2xl font-bold">{stats.today}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">
              Esta Semana
            </div>
            <div className="text-2xl font-bold">{stats.thisWeek}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Este Mês</div>
            <div className="text-2xl font-bold">{stats.thisMonth}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Próximos</div>
            <div className="text-2xl font-bold">{stats.upcoming}</div>
          </Card>
        </div>
      )}

      {/* Filters & View Toggle */}
      <div className="flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              Filtros
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Categoria</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={filters.category?.includes("meeting")}
              onCheckedChange={(checked) => {
                const current = filters.category || [];
                setFilters({
                  category: checked
                    ? [...current, "meeting"]
                    : current.filter((c) => c !== "meeting"),
                });
              }}
            >
              Reunião
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.category?.includes("rally")}
              onCheckedChange={(checked) => {
                const current = filters.category || [];
                setFilters({
                  category: checked
                    ? [...current, "rally"]
                    : current.filter((c) => c !== "rally"),
                });
              }}
            >
              Comício
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.category?.includes("door-to-door")}
              onCheckedChange={(checked) => {
                const current = filters.category || [];
                setFilters({
                  category: checked
                    ? [...current, "door-to-door"]
                    : current.filter((c) => c !== "door-to-door"),
                });
              }}
            >
              Corpo a Corpo
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={filters.status?.includes("scheduled")}
              onCheckedChange={(checked) => {
                const current = filters.status || [];
                setFilters({
                  status: checked
                    ? [...current, "scheduled"]
                    : current.filter((s) => s !== "scheduled"),
                });
              }}
            >
              Agendado
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.status?.includes("completed")}
              onCheckedChange={(checked) => {
                const current = filters.status || [];
                setFilters({
                  status: checked
                    ? [...current, "completed"]
                    : current.filter((s) => s !== "completed"),
                });
              }}
            >
              Concluído
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={clearFilters}
            >
              Limpar Filtros
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tabs
          value={view}
          onValueChange={(v) => setView(v as any)}
          className="w-fit"
        >
          <TabsList>
            <TabsTrigger value="month" className="gap-2">
              <CalendarIcon className="size-4" />
              Mês
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="size-4" />
              Lista
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Calendar/List View */}
      {isLoading ? (
        <Card className="p-12 text-center">
          <div className="text-muted-foreground">Carregando eventos...</div>
        </Card>
      ) : view === "month" ? (
        <CalendarView
          events={filteredEvents}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onDayClick={handleDayClick}
          onEventClick={(event) => openEventDialog(event)}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onToday={goToToday}
        />
      ) : (
        <EventListView
          events={filteredEvents}
          onEventClick={(event) => openEventDialog(event)}
        />
      )}

      {/* Event Form Dialog */}
      <EventFormDialog
        open={isEventDialogOpen}
        onClose={closeEventDialog}
        event={selectedEvent}
        defaultDate={selectedDay || undefined}
        onSubmit={handleEventSubmit}
      />

      {/* Day Details Dialog */}
      <DayDetailsDialog
        open={isDayDialogOpen}
        onClose={handleCloseDayDialog}
        date={selectedDay}
        events={getDayEvents(selectedDay)}
        onEventClick={(event) => openEventDialog(event)}
        onCreateEvent={() => {
          handleCloseDayDialog();
          openEventDialog();
        }}
      />
    </div>
  );
}
