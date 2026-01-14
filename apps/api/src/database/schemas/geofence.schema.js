"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geofences = exports.geofenceTypeEnum = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
/**
 * Geofence type enum
 */
exports.geofenceTypeEnum = (0, pg_core_1.pgEnum)('geofence_type', ['CIRCLE', 'POLYGON']);
/**
 * Geofences table - Campaign geographic zones
 * Used for organizing voters by geographic areas
 */
exports.geofences = (0, pg_core_1.pgTable)('geofences', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    type: (0, exports.geofenceTypeEnum)('type').notNull().default('CIRCLE'),
    // For circular geofences
    centerLatitude: (0, pg_core_1.numeric)('center_latitude', { precision: 10, scale: 7 }),
    centerLongitude: (0, pg_core_1.numeric)('center_longitude', { precision: 10, scale: 7 }),
    radiusKm: (0, pg_core_1.numeric)('radius_km', { precision: 10, scale: 3 }),
    // For polygon geofences (stored as GeoJSON)
    polygon: (0, pg_core_1.jsonb)('polygon'), // Array of {lat, lng} points
    // Associated location info
    city: (0, pg_core_1.varchar)('city', { length: 100 }),
    state: (0, pg_core_1.varchar)('state', { length: 2 }),
    neighborhood: (0, pg_core_1.varchar)('neighborhood', { length: 100 }),
    // Metadata
    color: (0, pg_core_1.varchar)('color', { length: 7 }).default('#3B82F6'), // Hex color for map display
    tags: (0, pg_core_1.text)('tags'), // JSON array of tags
    notes: (0, pg_core_1.text)('notes'),
    // Audit fields
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
    deletedAt: (0, pg_core_1.timestamp)('deleted_at'),
});
