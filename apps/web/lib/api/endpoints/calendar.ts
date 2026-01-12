import type {
  CalendarEvent,
  CreateEventInput,
  UpdateEventInput,
  EventFilters,
  EventStats,
} from "@/types/calendar";
import type { ApiResponse } from "@/types/api";
import { apiClient } from "../client";

// Type mapping between frontend and backend
type BackendEvent = {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  visibility: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  allDay?: boolean;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: string;
  longitude?: string;
  expectedAttendees?: string;
  confirmedAttendees?: string;
  organizer?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
  tags?: string;
  color?: string;
  reminderSet?: boolean;
  reminderMinutesBefore?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

// Map backend event to frontend format
const mapBackendToFrontend = (event: BackendEvent): CalendarEvent => {
  const tags = event.tags ? JSON.parse(event.tags) : [];

  // Extract date from ISO string if needed (backend returns ISO timestamps)
  const startDateStr = event.startDate.includes("T")
    ? event.startDate.split("T")[0]
    : event.startDate;
  const endDateStr = event.endDate.includes("T")
    ? event.endDate.split("T")[0]
    : event.endDate;

  return {
    id: event.id,
    title: event.title,
    description: event.description,
    category: mapTypeToCategory(event.type),
    status: mapBackendStatus(event.status),
    priority: "medium", // Backend doesn't have priority, default to medium
    startDate: `${startDateStr}T${event.startTime}`,
    endDate: `${endDateStr}T${event.endTime}`,
    allDay: event.allDay || false,
    location:
      event.city && event.state
        ? {
            address: event.address || event.location || "",
            city: event.city,
            state: event.state,
            coordinates:
              event.latitude && event.longitude
                ? {
                    lat: parseFloat(event.latitude),
                    lng: parseFloat(event.longitude),
                  }
                : undefined,
          }
        : undefined,
    isVirtual: false,
    organizer: event.organizer || "system",
    attendees: [],
    campaignId: "current",
    reminders: [],
    tags,
    color: event.color,
    notes: event.notes,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
    createdBy: "system",
  };
};

// Map frontend input to backend format
const mapFrontendToBackend = (input: CreateEventInput | UpdateEventInput) => {
  const startDateTime = new Date(input.startDate);
  const endDateTime = new Date(input.endDate);

  return {
    title: input.title,
    description: input.description,
    type: mapCategoryToType(input.category),
    status: mapFrontendStatus(input.status),
    visibility: "PUBLICO",
    startDate: startDateTime.toISOString().split("T")[0],
    startTime: startDateTime.toTimeString().slice(0, 5),
    endDate: endDateTime.toISOString().split("T")[0],
    endTime: endDateTime.toTimeString().slice(0, 5),
    allDay: input.allDay,
    location: input.location?.address,
    address: input.location?.address,
    city: input.location?.city,
    state: input.location?.state,
    latitude: input.location?.coordinates?.lat.toString(),
    longitude: input.location?.coordinates?.lng.toString(),
    notes: input.notes,
    tags: JSON.stringify(input.tags || []),
    color: input.color,
  };
};

// Type mappings
const mapTypeToCategory = (type: string): CalendarEvent["category"] => {
  const map: Record<string, CalendarEvent["category"]> = {
    COMICIO: "rally",
    REUNIAO: "meeting",
    VISITA: "door-to-door",
    ENTREVISTA: "media",
    DEBATE: "debate",
    CAMINHADA: "door-to-door",
    CORPO_A_CORPO: "door-to-door",
    EVENTO_PRIVADO: "other",
    OUTRO: "other",
  };
  return map[type] || "other";
};

const mapCategoryToType = (category: CalendarEvent["category"]): string => {
  const map: Record<CalendarEvent["category"], string> = {
    rally: "COMICIO",
    meeting: "REUNIAO",
    "door-to-door": "CORPO_A_CORPO",
    media: "ENTREVISTA",
    debate: "DEBATE",
    fundraiser: "EVENTO_PRIVADO",
    "phone-bank": "OUTRO",
    volunteer: "OUTRO",
    training: "REUNIAO",
    other: "OUTRO",
  };
  return map[category] || "OUTRO";
};

const mapBackendStatus = (status: string): CalendarEvent["status"] => {
  const map: Record<string, CalendarEvent["status"]> = {
    AGENDADO: "scheduled",
    EM_ANDAMENTO: "in-progress",
    CONCLUIDO: "completed",
    CANCELADO: "cancelled",
    ADIADO: "scheduled",
  };
  return map[status] || "scheduled";
};

const mapFrontendStatus = (status: CalendarEvent["status"]): string => {
  const map: Record<CalendarEvent["status"], string> = {
    scheduled: "AGENDADO",
    "in-progress": "EM_ANDAMENTO",
    completed: "CONCLUIDO",
    cancelled: "CANCELADO",
  };
  return map[status] || "AGENDADO";
};

export const calendarApi = {
  // List events with filters
  async list(filters?: EventFilters): Promise<ApiResponse<CalendarEvent[]>> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.startDate) params.append("startDateFrom", filters.startDate);
    if (filters?.endDate) params.append("startDateTo", filters.endDate);
    if (filters?.city) params.append("city", filters.city);

    // Add pagination params to fetch all
    params.append("page", "1");
    params.append("limit", "1000");

    const response = await apiClient.get<BackendEvent[]>(
      `/calendar?${params.toString()}`
    );

    // The HTTP adapter extracts response.data.data into response.data for us
    const backendEvents = Array.isArray(response.data) ? response.data : [];
    const events = backendEvents.map(mapBackendToFrontend);
    return { data: events };
  },

  // Get event by ID
  async getById(id: string): Promise<ApiResponse<CalendarEvent>> {
    const response = await apiClient.get<BackendEvent>(`/calendar/${id}`);
    const event = mapBackendToFrontend(response.data);
    return { data: event };
  },

  // Get events by date range
  async getByDateRange(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<CalendarEvent[]>> {
    const response = await apiClient.get<BackendEvent[]>(
      `/calendar/date-range?startDate=${startDate}&endDate=${endDate}`
    );
    const backendEvents = Array.isArray(response.data) ? response.data : [];
    const events = backendEvents.map(mapBackendToFrontend);
    return { data: events };
  },

  // Get events by month
  async getByMonth(
    year: number,
    month: number
  ): Promise<ApiResponse<CalendarEvent[]>> {
    const startDate = new Date(year, month, 1).toISOString().split("T")[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0];

    return this.getByDateRange(startDate, endDate);
  },

  // Get today's events
  async getToday(): Promise<ApiResponse<CalendarEvent[]>> {
    const today = new Date().toISOString().split("T")[0];
    return this.getByDateRange(today, today);
  },

  // Get upcoming events
  async getUpcoming(limit?: number): Promise<ApiResponse<CalendarEvent[]>> {
    const response = await apiClient.get<BackendEvent[]>(
      `/calendar/upcoming?limit=${limit || 10}`
    );
    const backendEvents = Array.isArray(response.data) ? response.data : [];
    const events = backendEvents.map(mapBackendToFrontend);
    return { data: events };
  },

  // Create event
  async create(input: CreateEventInput): Promise<ApiResponse<CalendarEvent>> {
    const backendData = mapFrontendToBackend(input);
    const response = await apiClient.post<BackendEvent>(
      "/calendar",
      backendData
    );
    const event = mapBackendToFrontend(response.data);
    return { data: event };
  },

  // Update event
  async update(
    id: string,
    input: UpdateEventInput
  ): Promise<ApiResponse<CalendarEvent>> {
    const backendData = mapFrontendToBackend(input);
    const response = await apiClient.patch<BackendEvent>(
      `/calendar/${id}`,
      backendData
    );
    const event = mapBackendToFrontend(response.data);
    return { data: event };
  },

  // Delete event
  async delete(id: string): Promise<ApiResponse<void>> {
    await apiClient.delete(`/calendar/${id}`);
    return { data: undefined };
  },

  // Get statistics
  async getStats(): Promise<ApiResponse<EventStats>> {
    const response = await apiClient.get<any>("/calendar/statistics");
    const backendStats = response.data || {};

    // Map backend stats to frontend format
    const stats: EventStats = {
      total: backendStats.total || 0,
      byCategory: {
        meeting: backendStats.byType?.REUNIAO || 0,
        rally: backendStats.byType?.COMICIO || 0,
        "door-to-door":
          (backendStats.byType?.CORPO_A_CORPO || 0) +
          (backendStats.byType?.VISITA || 0) +
          (backendStats.byType?.CAMINHADA || 0),
        "phone-bank": 0,
        fundraiser: backendStats.byType?.EVENTO_PRIVADO || 0,
        debate: backendStats.byType?.DEBATE || 0,
        media: backendStats.byType?.ENTREVISTA || 0,
        volunteer: 0,
        training: 0,
        other: backendStats.byType?.OUTRO || 0,
      },
      byStatus: {
        scheduled: backendStats.byStatus?.AGENDADO || 0,
        "in-progress": backendStats.byStatus?.EM_ANDAMENTO || 0,
        completed: backendStats.byStatus?.CONCLUIDO || 0,
        cancelled: backendStats.byStatus?.CANCELADO || 0,
      },
      upcoming: backendStats.upcoming || 0,
      today: backendStats.today || 0,
      thisWeek: backendStats.thisWeek || 0,
      thisMonth: backendStats.thisMonth || 0,
    };

    return { data: stats };
  },

  // Update event status
  async updateStatus(
    id: string,
    status: CalendarEvent["status"]
  ): Promise<ApiResponse<CalendarEvent>> {
    const backendStatus = mapFrontendStatus(status);
    const response = await apiClient.patch<BackendEvent>(`/calendar/${id}`, {
      status: backendStatus,
    });
    const event = mapBackendToFrontend(response.data);
    return { data: event };
  },

  // Add attendee (not implemented in backend yet)
  async addAttendee(
    eventId: string,
    attendee: CalendarEvent["attendees"][0]
  ): Promise<ApiResponse<CalendarEvent>> {
    // For now, just return the event unchanged
    return this.getById(eventId);
  },

  // Remove attendee (not implemented in backend yet)
  async removeAttendee(
    eventId: string,
    attendeeId: string
  ): Promise<ApiResponse<CalendarEvent>> {
    // For now, just return the event unchanged
    return this.getById(eventId);
  },
};
