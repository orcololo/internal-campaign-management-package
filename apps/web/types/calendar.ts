export type EventCategory =
  | "meeting"
  | "rally"
  | "door-to-door"
  | "phone-bank"
  | "fundraiser"
  | "debate"
  | "media"
  | "volunteer"
  | "training"
  | "other";

export type EventStatus =
  | "scheduled"
  | "in-progress"
  | "completed"
  | "cancelled";

export type EventPriority = "low" | "medium" | "high" | "urgent";

export type ReminderType = "email" | "sms" | "notification";

export interface EventReminder {
  id: string;
  type: ReminderType;
  minutesBefore: number; // 15, 30, 60, 1440 (1 day), etc.
  sent: boolean;
  sentAt?: string;
}

export interface EventAttendee {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: "organizer" | "speaker" | "volunteer" | "guest";
  confirmed: boolean;
}

export interface EventLocation {
  address: string;
  city: string;
  state: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  placeId?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  category: EventCategory;
  status: EventStatus;
  priority: EventPriority;

  // Dates & Time
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  allDay: boolean;

  // Location
  location?: EventLocation;
  isVirtual: boolean;
  meetingLink?: string;

  // Participants
  organizer: string; // User ID
  attendees: EventAttendee[];
  expectedAttendance?: number;
  actualAttendance?: number;

  // Campaign Integration
  campaignId: string;
  relatedVoters?: string[]; // Voter IDs (deprecated - use linkedVoters)
  linkedVoters?: string[]; // Voter IDs linked to this event
  reminders: EventReminder[]; // Event reminders
  tags: string[];

  // Metadata
  color?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface EventFilters {
  category?: EventCategory[];
  status?: EventStatus[];
  priority?: EventPriority[];
  startDate?: string;
  endDate?: string;
  search?: string;
  tags?: string[];
  city?: string;
}

export interface EventSortOptions {
  field: "startDate" | "title" | "priority" | "category" | "createdAt";
  direction: "asc" | "desc";
}

export interface CreateEventInput {
  title: string;
  description?: string;
  category: EventCategory;
  priority: EventPriority;
  startDate: string;
  endDate: string;
  allDay: boolean;
  location?: EventLocation;
  isVirtual: boolean;
  meetingLink?: string;
  expectedAttendance?: number;
  tags: string[];
  notes?: string;
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  status?: EventStatus;
  actualAttendance?: number;
}

export interface EventStats {
  total: number;
  byCategory: Record<EventCategory, number>;
  byStatus: Record<EventStatus, number>;
  upcoming: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}
