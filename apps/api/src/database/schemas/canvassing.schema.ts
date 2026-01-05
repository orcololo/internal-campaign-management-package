import { pgTable, uuid, varchar, timestamp, text, boolean, date, integer, pgEnum } from 'drizzle-orm/pg-core';

/**
 * Enums for canvassing
 */
export const canvassingSessionStatusEnum = pgEnum('canvassing_session_status', [
  'PLANEJADA',
  'EM_ANDAMENTO',
  'CONCLUIDA',
  'CANCELADA',
]);

export const doorKnockResultEnum = pgEnum('door_knock_result', [
  'APOIADOR',
  'INDECISO',
  'OPOSITOR',
  'NAO_ATENDEU',
  'RECUSOU_CONTATO',
  'MUDOU',
]);

/**
 * Canvassing Sessions table
 * Represents a canvassing session/route
 */
export const canvassingSessions = pgTable('canvassing_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Basic Information
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  status: canvassingSessionStatusEnum('status').notNull().default('PLANEJADA'),

  // Date and Assignment
  scheduledDate: date('scheduled_date').notNull(),
  completedDate: timestamp('completed_date'),
  assignedTo: varchar('assigned_to', { length: 255 }), // Volunteer/Team leader name
  teamMembers: text('team_members'), // JSON array of team member names

  // Location/Route
  region: varchar('region', { length: 100 }),
  neighborhood: varchar('neighborhood', { length: 100 }),
  city: varchar('city', { length: 100 }),
  startLocation: text('start_location'),
  endLocation: text('end_location'),

  // Route Coordinates (for GPS tracking)
  routeCoordinates: text('route_coordinates'), // JSON array of lat/lng points

  // Targets
  targetVoters: integer('target_voters'), // How many voters to reach
  actualVoters: integer('actual_voters').default(0), // Actually reached

  // Results Summary
  totalDoorKnocks: integer('total_door_knocks').default(0),
  supporters: integer('supporters').default(0),
  undecided: integer('undecided').default(0),
  opponents: integer('opponents').default(0),
  notHome: integer('not_home').default(0),

  // Additional Information
  notes: text('notes'),
  tags: text('tags'), // JSON array of tags

  // Audit fields
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

/**
 * Door Knocks table
 * Individual interactions during canvassing
 */
export const doorKnocks = pgTable('door_knocks', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Session Reference
  sessionId: uuid('session_id').notNull().references(() => canvassingSessions.id),

  // Voter Reference (optional - might be a new contact)
  voterId: uuid('voter_id'), // References voters.id

  // Location
  address: text('address').notNull(),
  addressNumber: varchar('address_number', { length: 10 }),
  neighborhood: varchar('neighborhood', { length: 100 }),
  latitude: varchar('latitude', { length: 50 }),
  longitude: varchar('longitude', { length: 50 }),

  // Interaction
  result: doorKnockResultEnum('result').notNull(),
  contactedAt: timestamp('contacted_at').notNull().defaultNow(),
  contactedBy: varchar('contacted_by', { length: 255 }), // Volunteer name

  // Contact Information (if new voter)
  contactName: varchar('contact_name', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 20 }),
  contactWhatsapp: varchar('contact_whatsapp', { length: 20 }),
  contactEmail: varchar('contact_email', { length: 255 }),

  // Interaction Details
  notes: text('notes'),
  issues: text('issues'), // Main concerns mentioned
  promises: text('promises'), // What was promised/offered
  followUpRequired: boolean('follow_up_required').default(false),
  followUpDate: date('follow_up_date'),

  // Material Distribution
  materialsDelivered: text('materials_delivered'), // JSON array of materials

  // Audit fields
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export type CanvassingSession = typeof canvassingSessions.$inferSelect;
export type NewCanvassingSession = typeof canvassingSessions.$inferInsert;
export type DoorKnock = typeof doorKnocks.$inferSelect;
export type NewDoorKnock = typeof doorKnocks.$inferInsert;
export type CanvassingSessionStatus = typeof canvassingSessionStatusEnum.enumValues[number];
export type DoorKnockResult = typeof doorKnockResultEnum.enumValues[number];
