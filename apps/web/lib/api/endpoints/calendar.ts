import type {
  CalendarEvent,
  CreateEventInput,
  UpdateEventInput,
  EventFilters,
  EventStats,
} from "@/types/calendar";
import type { ApiResponse } from "@/types/api";
import { calendarDb } from "@/mock-data/calendar";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const calendarApi = {
  // List events with filters
  async list(filters?: EventFilters): Promise<ApiResponse<CalendarEvent[]>> {
    await delay(300);

    let events = calendarDb.getAll();

    if (filters) {
      const {
        category,
        status,
        priority,
        startDate,
        endDate,
        search,
        tags,
        city,
      } = filters;

      events = events.filter((event) => {
        // Category filter
        if (
          category &&
          category.length > 0 &&
          !category.includes(event.category)
        ) {
          return false;
        }

        // Status filter
        if (status && status.length > 0 && !status.includes(event.status)) {
          return false;
        }

        // Priority filter
        if (
          priority &&
          priority.length > 0 &&
          !priority.includes(event.priority)
        ) {
          return false;
        }

        // Date range filter
        if (startDate && new Date(event.startDate) < new Date(startDate)) {
          return false;
        }
        if (endDate && new Date(event.startDate) > new Date(endDate)) {
          return false;
        }

        // Search filter
        if (search) {
          const searchLower = search.toLowerCase();
          const matchesTitle = event.title.toLowerCase().includes(searchLower);
          const matchesDescription = event.description
            ?.toLowerCase()
            .includes(searchLower);
          if (!matchesTitle && !matchesDescription) {
            return false;
          }
        }

        // Tags filter
        if (tags && tags.length > 0) {
          const hasTag = tags.some((tag) => event.tags.includes(tag));
          if (!hasTag) return false;
        }

        // City filter
        if (city && event.location?.city !== city) {
          return false;
        }

        return true;
      });
    }

    // Sort by start date (most recent first)
    events.sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    return { data: events };
  },

  // Get event by ID
  async getById(id: string): Promise<ApiResponse<CalendarEvent>> {
    await delay(200);

    const event = calendarDb.getById(id);
    if (!event) {
      throw new Error(`Event not found: ${id}`);
    }

    return { data: event };
  },

  // Get events by date range
  async getByDateRange(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<CalendarEvent[]>> {
    await delay(300);

    const events = calendarDb.getByDateRange(startDate, endDate);
    return { data: events };
  },

  // Get events by month
  async getByMonth(
    year: number,
    month: number
  ): Promise<ApiResponse<CalendarEvent[]>> {
    await delay(300);

    const events = calendarDb.getByMonth(year, month);
    return { data: events };
  },

  // Get today's events
  async getToday(): Promise<ApiResponse<CalendarEvent[]>> {
    await delay(200);

    const events = calendarDb.getToday();
    return { data: events };
  },

  // Get upcoming events
  async getUpcoming(limit?: number): Promise<ApiResponse<CalendarEvent[]>> {
    await delay(200);

    const events = calendarDb.getUpcoming(limit);
    return { data: events };
  },

  // Create event
  async create(input: CreateEventInput): Promise<ApiResponse<CalendarEvent>> {
    await delay(400);

    const newEvent = calendarDb.create({
      ...input,
      status: "scheduled",
      organizer: "user-1", // Mock user
      attendees: [],
      campaignId: "campaign-1", // Mock campaign
      createdBy: "user-1",
    });

    return { data: newEvent };
  },

  // Update event
  async update(
    id: string,
    input: UpdateEventInput
  ): Promise<ApiResponse<CalendarEvent>> {
    await delay(400);

    const updated = calendarDb.update(id, input);
    if (!updated) {
      throw new Error(`Event not found: ${id}`);
    }

    return { data: updated };
  },

  // Delete event
  async delete(id: string): Promise<ApiResponse<void>> {
    await delay(300);

    const deleted = calendarDb.delete(id);
    if (!deleted) {
      throw new Error(`Event not found: ${id}`);
    }

    return { data: undefined };
  },

  // Get statistics
  async getStats(): Promise<ApiResponse<EventStats>> {
    await delay(200);

    const stats = calendarDb.getStats();
    return { data: stats };
  },

  // Update event status
  async updateStatus(
    id: string,
    status: CalendarEvent["status"]
  ): Promise<ApiResponse<CalendarEvent>> {
    await delay(300);

    const updated = calendarDb.update(id, { status });
    if (!updated) {
      throw new Error(`Event not found: ${id}`);
    }

    return { data: updated };
  },

  // Add attendee
  async addAttendee(
    eventId: string,
    attendee: CalendarEvent["attendees"][0]
  ): Promise<ApiResponse<CalendarEvent>> {
    await delay(300);

    const event = calendarDb.getById(eventId);
    if (!event) {
      throw new Error(`Event not found: ${eventId}`);
    }

    const updated = calendarDb.update(eventId, {
      attendees: [...event.attendees, attendee],
    });

    if (!updated) {
      throw new Error(`Failed to update event: ${eventId}`);
    }

    return { data: updated };
  },

  // Remove attendee
  async removeAttendee(
    eventId: string,
    attendeeId: string
  ): Promise<ApiResponse<CalendarEvent>> {
    await delay(300);

    const event = calendarDb.getById(eventId);
    if (!event) {
      throw new Error(`Event not found: ${eventId}`);
    }

    const updated = calendarDb.update(eventId, {
      attendees: event.attendees.filter((a) => a.id !== attendeeId),
    });

    if (!updated) {
      throw new Error(`Failed to update event: ${eventId}`);
    }

    return { data: updated };
  },
};
