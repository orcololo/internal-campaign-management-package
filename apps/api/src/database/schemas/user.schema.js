"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.userRoleEnum = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
/**
 * User roles for RBAC (Role-Based Access Control)
 */
exports.userRoleEnum = (0, pg_core_1.pgEnum)('user_role', [
    'CANDIDATO',
    'ESTRATEGISTA',
    'LIDERANCA',
    'ESCRITORIO',
]);
/**
 * Users table - This table structure is replicated in each tenant schema
 * Manages users within a specific campaign
 */
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    keycloakId: (0, pg_core_1.varchar)('keycloak_id', { length: 255 }).notNull().unique(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    role: (0, exports.userRoleEnum)('role').notNull().default('ESCRITORIO'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
    deletedAt: (0, pg_core_1.timestamp)('deleted_at'),
});
