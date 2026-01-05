import { pgTable, uuid, varchar, timestamp, text, boolean, date, time, pgEnum } from 'drizzle-orm/pg-core';

/**
 * Enums for events
 */
export const eventTypeEnum = pgEnum('event_type', [
  'COMICIO',
  'REUNIAO',
  'VISITA',
  'ENTREVISTA',
  'DEBATE',
  'CAMINHADA',
  'CORPO_A_CORPO',
  'EVENTO_PRIVADO',
  'OUTRO',
]);

export const eventStatusEnum = pgEnum('event_status', [
  'AGENDADO',
  'EM_ANDAMENTO',
  'CONCLUIDO',
  'CANCELADO',
  'ADIADO',
]);

export const eventVisibilityEnum = pgEnum('event_visibility', [
  'PUBLICO',
  'PRIVADO',
  'INTERNO',
]);

/**
 * Events/Calendar table - This table structure is replicated in each tenant schema
 * Manages campaign events and candidate's schedule
 */
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Basic Information
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  type: eventTypeEnum('type').notNull().default('OUTRO'),
  status: eventStatusEnum('status').notNull().default('AGENDADO'),
  visibility: eventVisibilityEnum('visibility').notNull().default('PUBLICO'),

  // Date and Time
  startDate: date('start_date').notNull(),
  startTime: time('start_time').notNull(),
  endDate: date('end_date').notNull(),
  endTime: time('end_time').notNull(),
  allDay: boolean('all_day').default(false),

  // Location Information
  location: varchar('location', { length: 255 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 2 }),
  zipCode: varchar('zip_code', { length: 10 }),
  latitude: varchar('latitude', { length: 50 }),
  longitude: varchar('longitude', { length: 50 }),

  // Participants
  expectedAttendees: varchar('expected_attendees', { length: 50 }), // e.g., "50-100", "500+"
  confirmedAttendees: varchar('confirmed_attendees', { length: 10 }),

  // Organization
  organizer: varchar('organizer', { length: 255 }),
  contactPerson: varchar('contact_person', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 20 }),
  contactEmail: varchar('contact_email', { length: 255 }),

  // Additional Information
  notes: text('notes'),
  tags: text('tags'), // JSON array of tags
  color: varchar('color', { length: 7 }), // Hex color for calendar display

  // Reminder/Notification
  reminderSet: boolean('reminder_set').default(false),
  reminderMinutesBefore: varchar('reminder_minutes_before', { length: 10 }), // e.g., "15", "30", "60"

  // Integration
  googleCalendarEventId: varchar('google_calendar_event_id', { length: 255 }),

  // Audit fields
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type EventType = typeof eventTypeEnum.enumValues[number];
export type EventStatus = typeof eventStatusEnum.enumValues[number];
export type EventVisibility = typeof eventVisibilityEnum.enumValues[number];
