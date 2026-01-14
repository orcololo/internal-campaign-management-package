"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doorKnocks = exports.canvassingSessions = exports.doorKnockResultEnum = exports.canvassingSessionStatusEnum = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
/**
 * Enums for canvassing
 */
exports.canvassingSessionStatusEnum = (0, pg_core_1.pgEnum)('canvassing_session_status', [
    'PLANEJADA',
    'EM_ANDAMENTO',
    'CONCLUIDA',
    'CANCELADA',
]);
exports.doorKnockResultEnum = (0, pg_core_1.pgEnum)('door_knock_result', [
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
exports.canvassingSessions = (0, pg_core_1.pgTable)('canvassing_sessions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    // Basic Information
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    status: (0, exports.canvassingSessionStatusEnum)('status').notNull().default('PLANEJADA'),
    // Date and Assignment
    scheduledDate: (0, pg_core_1.date)('scheduled_date').notNull(),
    completedDate: (0, pg_core_1.timestamp)('completed_date'),
    assignedTo: (0, pg_core_1.varchar)('assigned_to', { length: 255 }), // Volunteer/Team leader name
    teamMembers: (0, pg_core_1.text)('team_members'), // JSON array of team member names
    // Location/Route
    region: (0, pg_core_1.varchar)('region', { length: 100 }),
    neighborhood: (0, pg_core_1.varchar)('neighborhood', { length: 100 }),
    city: (0, pg_core_1.varchar)('city', { length: 100 }),
    startLocation: (0, pg_core_1.text)('start_location'),
    endLocation: (0, pg_core_1.text)('end_location'),
    // Route Coordinates (for GPS tracking)
    routeCoordinates: (0, pg_core_1.text)('route_coordinates'), // JSON array of lat/lng points
    // Targets
    targetVoters: (0, pg_core_1.integer)('target_voters'), // How many voters to reach
    actualVoters: (0, pg_core_1.integer)('actual_voters').default(0), // Actually reached
    // Results Summary
    totalDoorKnocks: (0, pg_core_1.integer)('total_door_knocks').default(0),
    supporters: (0, pg_core_1.integer)('supporters').default(0),
    undecided: (0, pg_core_1.integer)('undecided').default(0),
    opponents: (0, pg_core_1.integer)('opponents').default(0),
    notHome: (0, pg_core_1.integer)('not_home').default(0),
    // Additional Information
    notes: (0, pg_core_1.text)('notes'),
    tags: (0, pg_core_1.text)('tags'), // JSON array of tags
    // Audit fields
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
    deletedAt: (0, pg_core_1.timestamp)('deleted_at'),
});
/**
 * Door Knocks table
 * Individual interactions during canvassing
 */
exports.doorKnocks = (0, pg_core_1.pgTable)('door_knocks', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    // Session Reference
    sessionId: (0, pg_core_1.uuid)('session_id')
        .notNull()
        .references(function () { return exports.canvassingSessions.id; }),
    // Voter Reference (optional - might be a new contact)
    voterId: (0, pg_core_1.uuid)('voter_id'), // References voters.id
    // Location
    address: (0, pg_core_1.text)('address').notNull(),
    addressNumber: (0, pg_core_1.varchar)('address_number', { length: 10 }),
    neighborhood: (0, pg_core_1.varchar)('neighborhood', { length: 100 }),
    latitude: (0, pg_core_1.varchar)('latitude', { length: 50 }),
    longitude: (0, pg_core_1.varchar)('longitude', { length: 50 }),
    // Interaction
    result: (0, exports.doorKnockResultEnum)('result').notNull(),
    contactedAt: (0, pg_core_1.timestamp)('contacted_at').notNull().defaultNow(),
    contactedBy: (0, pg_core_1.varchar)('contacted_by', { length: 255 }), // Volunteer name
    // Contact Information (if new voter)
    contactName: (0, pg_core_1.varchar)('contact_name', { length: 255 }),
    contactPhone: (0, pg_core_1.varchar)('contact_phone', { length: 20 }),
    contactWhatsapp: (0, pg_core_1.varchar)('contact_whatsapp', { length: 20 }),
    contactEmail: (0, pg_core_1.varchar)('contact_email', { length: 255 }),
    // Interaction Details
    notes: (0, pg_core_1.text)('notes'),
    issues: (0, pg_core_1.text)('issues'), // Main concerns mentioned
    promises: (0, pg_core_1.text)('promises'), // What was promised/offered
    followUpRequired: (0, pg_core_1.boolean)('follow_up_required').default(false),
    followUpDate: (0, pg_core_1.date)('follow_up_date'),
    // Material Distribution
    materialsDelivered: (0, pg_core_1.text)('materials_delivered'), // JSON array of materials
    // Audit fields
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
    deletedAt: (0, pg_core_1.timestamp)('deleted_at'),
});
