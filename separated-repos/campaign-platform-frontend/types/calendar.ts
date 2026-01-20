import {
  CalendarEvent as SharedEvent,
  EventFilters as SharedFilters,
  EventStats as SharedStats,
  EventCategory,
  EventStatus,
  EventPriority,
  ReminderType,
  EventReminder,
  EventAttendee,
  EventLocation,
  EventSortOptions,
  CreateEventRequest,
  UpdateEventRequest
} from "./shared/calendar";

export type {
  EventCategory,
  EventStatus,
  EventPriority,
  ReminderType,
  EventReminder,
  EventAttendee,
  EventLocation,
  EventSortOptions,
  CreateEventRequest as CreateEventInput,
  UpdateEventRequest as UpdateEventInput
};

export interface CalendarEvent extends SharedEvent { }
export interface EventFilters extends SharedFilters { }
export interface EventStats extends SharedStats { }
