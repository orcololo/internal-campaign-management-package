import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  CalendarEvent,
  EventFilters,
  EventStats,
  CreateEventInput,
  UpdateEventInput,
} from "@/types/calendar";
import { calendarApi } from "@/lib/api/endpoints/calendar";
import { toast } from "sonner";

type CalendarView = "month" | "week" | "day" | "list";

interface CalendarState {
  // Data
  events: CalendarEvent[];
  selectedEvent: CalendarEvent | null;
  stats: EventStats | null;

  // UI State
  currentDate: Date;
  view: CalendarView;
  filters: EventFilters;
  isLoading: boolean;
  error: string | null;

  // Dialog states
  isEventDialogOpen: boolean;
  isEditMode: boolean;

  // Actions - Data
  fetchEvents: () => Promise<void>;
  fetchEventsByDateRange: (startDate: string, endDate: string) => Promise<void>;
  fetchEventsByMonth: (year: number, month: number) => Promise<void>;
  fetchToday: () => Promise<void>;
  fetchUpcoming: (limit?: number) => Promise<void>;
  fetchStats: () => Promise<void>;
  selectEvent: (event: CalendarEvent | null) => void;
  createEvent: (input: CreateEventInput) => Promise<void>;
  updateEvent: (id: string, input: UpdateEventInput) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  updateEventStatus: (
    id: string,
    status: CalendarEvent["status"]
  ) => Promise<void>;

  // Actions - UI
  setCurrentDate: (date: Date) => void;
  setView: (view: CalendarView) => void;
  setFilters: (filters: Partial<EventFilters>) => void;
  clearFilters: () => void;
  openEventDialog: (event?: CalendarEvent) => void;
  closeEventDialog: () => void;

  // Actions - Navigation
  goToToday: () => void;
  goToPrevious: () => void;
  goToNext: () => void;

  // Utilities
  reset: () => void;
}

const initialFilters: EventFilters = {};

const initialState = {
  events: [],
  selectedEvent: null,
  stats: null,
  currentDate: new Date(),
  view: "month" as CalendarView,
  filters: initialFilters,
  isLoading: false,
  error: null,
  isEventDialogOpen: false,
  isEditMode: false,
};

export const useCalendarStore = create<CalendarState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Fetch all events with current filters
      fetchEvents: async () => {
        try {
          set({ isLoading: true, error: null });
          const { filters } = get();
          const response = await calendarApi.list(filters);
          set({ events: response.data });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch events";
          set({ error: errorMessage });
          toast.error(errorMessage);
        } finally {
          set({ isLoading: false });
        }
      },

      // Fetch events by date range
      fetchEventsByDateRange: async (startDate: string, endDate: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await calendarApi.getByDateRange(startDate, endDate);
          set({ events: response.data });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch events";
          set({ error: errorMessage });
          toast.error(errorMessage);
        } finally {
          set({ isLoading: false });
        }
      },

      // Fetch events by month
      fetchEventsByMonth: async (year: number, month: number) => {
        try {
          set({ isLoading: true, error: null });
          const response = await calendarApi.getByMonth(year, month);
          set({ events: response.data });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch events";
          set({ error: errorMessage });
          toast.error(errorMessage);
        } finally {
          set({ isLoading: false });
        }
      },

      // Fetch today's events
      fetchToday: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await calendarApi.getToday();
          set({ events: response.data });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch events";
          set({ error: errorMessage });
          toast.error(errorMessage);
        } finally {
          set({ isLoading: false });
        }
      },

      // Fetch upcoming events
      fetchUpcoming: async (limit?: number) => {
        try {
          set({ isLoading: true, error: null });
          const response = await calendarApi.getUpcoming(limit);
          set({ events: response.data });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch events";
          set({ error: errorMessage });
          toast.error(errorMessage);
        } finally {
          set({ isLoading: false });
        }
      },

      // Fetch statistics
      fetchStats: async () => {
        try {
          const response = await calendarApi.getStats();
          set({ stats: response.data });
        } catch (error) {
          console.error("Failed to fetch stats:", error);
        }
      },

      // Select event
      selectEvent: (event) => {
        set({ selectedEvent: event });
      },

      // Create event
      createEvent: async (input) => {
        try {
          set({ isLoading: true, error: null });
          const response = await calendarApi.create(input);
          const { events } = get();
          set({ events: [response.data, ...events] });
          toast.success("Evento criado com sucesso!");
          get().closeEventDialog();
          get().fetchStats();
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to create event";
          set({ error: errorMessage });
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Update event
      updateEvent: async (id, input) => {
        try {
          set({ isLoading: true, error: null });
          const response = await calendarApi.update(id, input);
          const { events } = get();
          set({
            events: events.map((e) => (e.id === id ? response.data : e)),
            selectedEvent: response.data,
          });
          toast.success("Evento atualizado com sucesso!");
          get().closeEventDialog();
          get().fetchStats();
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to update event";
          set({ error: errorMessage });
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Delete event
      deleteEvent: async (id) => {
        try {
          set({ isLoading: true, error: null });
          await calendarApi.delete(id);
          const { events } = get();
          set({
            events: events.filter((e) => e.id !== id),
            selectedEvent: null,
          });
          toast.success("Evento excluído com sucesso!");
          get().fetchStats();
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to delete event";
          set({ error: errorMessage });
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Update event status
      updateEventStatus: async (id, status) => {
        try {
          const response = await calendarApi.updateStatus(id, status);
          const { events } = get();
          set({
            events: events.map((e) => (e.id === id ? response.data : e)),
          });
          toast.success("Status atualizado!");
          get().fetchStats();
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to update status";
          toast.error(errorMessage);
          throw error;
        }
      },

      // Set current date
      setCurrentDate: (date) => {
        set({ currentDate: date });
      },

      // Set view
      setView: (view) => {
        set({ view });
      },

      // Set filters
      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      // Clear filters
      clearFilters: () => {
        set({ filters: initialFilters });
      },

      // Open event dialog
      openEventDialog: (event) => {
        set({
          isEventDialogOpen: true,
          isEditMode: !!event,
          selectedEvent: event || null,
        });
      },

      // Close event dialog
      closeEventDialog: () => {
        set({
          isEventDialogOpen: false,
          isEditMode: false,
          selectedEvent: null,
        });
      },

      // Go to today
      goToToday: () => {
        set({ currentDate: new Date() });
      },

      // Go to previous period
      goToPrevious: () => {
        const { currentDate, view } = get();
        const newDate = new Date(currentDate);

        switch (view) {
          case "month":
            newDate.setMonth(newDate.getMonth() - 1);
            break;
          case "week":
            newDate.setDate(newDate.getDate() - 7);
            break;
          case "day":
            newDate.setDate(newDate.getDate() - 1);
            break;
        }

        set({ currentDate: newDate });
      },

      // Go to next period
      goToNext: () => {
        const { currentDate, view } = get();
        const newDate = new Date(currentDate);

        switch (view) {
          case "month":
            newDate.setMonth(newDate.getMonth() + 1);
            break;
          case "week":
            newDate.setDate(newDate.getDate() + 7);
            break;
          case "day":
            newDate.setDate(newDate.getDate() + 1);
            break;
        }

        set({ currentDate: newDate });
      },

      // Reset
      reset: () => {
        set(initialState);
      },
    }),
    { name: "CalendarStore" }
  )
);
