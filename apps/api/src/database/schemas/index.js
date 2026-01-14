"use strict";
/**
 * Database Schemas Index
 *
 * Export all database schemas for use throughout the application
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Main tenant schema (in public schema)
__exportStar(require("./tenant.schema"), exports);
// Tenant-specific schemas (replicated in each tenant schema)
__exportStar(require("./user.schema"), exports);
__exportStar(require("./voter.schema"), exports);
__exportStar(require("./geofence.schema"), exports);
__exportStar(require("./event.schema"), exports);
__exportStar(require("./canvassing.schema"), exports);
__exportStar(require("./analytics.schema"), exports);
// Reports schemas
__exportStar(require("./saved-report.schema"), exports);
__exportStar(require("./report-export.schema"), exports);
