import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  numeric,
  pgEnum,
  jsonb,
} from 'drizzle-orm/pg-core';

/**
 * Geofence type enum
 */
export const geofenceTypeEnum = pgEnum('geofence_type', ['CIRCLE', 'POLYGON']);

/**
 * Geofences table - Campaign geographic zones
 * Used for organizing voters by geographic areas
 */
export const geofences = pgTable('geofences', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  type: geofenceTypeEnum('type').notNull().default('CIRCLE'),

  // For circular geofences
  centerLatitude: numeric('center_latitude', { precision: 10, scale: 7 }),
  centerLongitude: numeric('center_longitude', { precision: 10, scale: 7 }),
  radiusKm: numeric('radius_km', { precision: 10, scale: 3 }),

  // For polygon geofences (stored as GeoJSON)
  polygon: jsonb('polygon'), // Array of {lat, lng} points

  // Associated location info
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 2 }),
  neighborhood: varchar('neighborhood', { length: 100 }),

  // Metadata
  color: varchar('color', { length: 7 }).default('#3B82F6'), // Hex color for map display
  tags: text('tags'), // JSON array of tags
  notes: text('notes'),

  // Audit fields
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export type Geofence = typeof geofences.$inferSelect;
export type NewGeofence = typeof geofences.$inferInsert;
export type GeofenceType = (typeof geofenceTypeEnum.enumValues)[number];
