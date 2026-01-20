"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.events = exports.eventVisibilityEnum = exports.eventStatusEnum = exports.eventTypeEnum = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
/**
 * Enums for events
 */
exports.eventTypeEnum = (0, pg_core_1.pgEnum)('event_type', [
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
exports.eventStatusEnum = (0, pg_core_1.pgEnum)('event_status', [
    'AGENDADO',
    'EM_ANDAMENTO',
    'CONCLUIDO',
    'CANCELADO',
    'ADIADO',
]);
exports.eventVisibilityEnum = (0, pg_core_1.pgEnum)('event_visibility', ['PUBLICO', 'PRIVADO', 'INTERNO']);
/**
 * Events/Calendar table - This table structure is replicated in each tenant schema
 * Manages campaign events and candidate's schedule
 */
exports.events = (0, pg_core_1.pgTable)('events', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    // Basic Information
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    type: (0, exports.eventTypeEnum)('type').notNull().default('OUTRO'),
    status: (0, exports.eventStatusEnum)('status').notNull().default('AGENDADO'),
    visibility: (0, exports.eventVisibilityEnum)('visibility').notNull().default('PUBLICO'),
    // Date and Time
    startDate: (0, pg_core_1.date)('start_date').notNull(),
    startTime: (0, pg_core_1.time)('start_time').notNull(),
    endDate: (0, pg_core_1.date)('end_date').notNull(),
    endTime: (0, pg_core_1.time)('end_time').notNull(),
    allDay: (0, pg_core_1.boolean)('all_day').default(false),
    // Location Information
    location: (0, pg_core_1.varchar)('location', { length: 255 }),
    address: (0, pg_core_1.text)('address'),
    city: (0, pg_core_1.varchar)('city', { length: 100 }),
    state: (0, pg_core_1.varchar)('state', { length: 2 }),
    zipCode: (0, pg_core_1.varchar)('zip_code', { length: 10 }),
    latitude: (0, pg_core_1.varchar)('latitude', { length: 50 }),
    longitude: (0, pg_core_1.varchar)('longitude', { length: 50 }),
    // Participants
    expectedAttendees: (0, pg_core_1.varchar)('expected_attendees', { length: 50 }), // e.g., "50-100", "500+"
    confirmedAttendees: (0, pg_core_1.varchar)('confirmed_attendees', { length: 10 }),
    // Organization
    organizer: (0, pg_core_1.varchar)('organizer', { length: 255 }),
    contactPerson: (0, pg_core_1.varchar)('contact_person', { length: 255 }),
    contactPhone: (0, pg_core_1.varchar)('contact_phone', { length: 20 }),
    contactEmail: (0, pg_core_1.varchar)('contact_email', { length: 255 }),
    // Additional Information
    notes: (0, pg_core_1.text)('notes'),
    tags: (0, pg_core_1.text)('tags'), // JSON array of tags
    color: (0, pg_core_1.varchar)('color', { length: 7 }), // Hex color for calendar display
    // Reminder/Notification
    reminderSet: (0, pg_core_1.boolean)('reminder_set').default(false),
    reminderMinutesBefore: (0, pg_core_1.varchar)('reminder_minutes_before', { length: 10 }), // e.g., "15", "30", "60"
    // Integration
    googleCalendarEventId: (0, pg_core_1.varchar)('google_calendar_event_id', { length: 255 }),
    // Audit fields
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
    deletedAt: (0, pg_core_1.timestamp)('deleted_at'),
});
