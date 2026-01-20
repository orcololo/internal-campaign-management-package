"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeofencesService = void 0;
var common_1 = require("@nestjs/common");
var drizzle_orm_1 = require("drizzle-orm");
var schemas_1 = require("../database/schemas");
var GeofencesService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var GeofencesService = _classThis = /** @class */ (function () {
        function GeofencesService_1(databaseService, mapsService) {
            this.databaseService = databaseService;
            this.mapsService = mapsService;
        }
        GeofencesService_1.prototype.create = function (createGeofenceDto) {
            return __awaiter(this, void 0, void 0, function () {
                var db, values, geofence;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            values = {
                                name: createGeofenceDto.name,
                                description: createGeofenceDto.description,
                                type: createGeofenceDto.type,
                                city: createGeofenceDto.city,
                                state: createGeofenceDto.state,
                                neighborhood: createGeofenceDto.neighborhood,
                                color: createGeofenceDto.color,
                                tags: createGeofenceDto.tags,
                                notes: createGeofenceDto.notes,
                            };
                            if (createGeofenceDto.type === 'CIRCLE') {
                                values.centerLatitude = (_a = createGeofenceDto.centerLatitude) === null || _a === void 0 ? void 0 : _a.toString();
                                values.centerLongitude = (_b = createGeofenceDto.centerLongitude) === null || _b === void 0 ? void 0 : _b.toString();
                                values.radiusKm = (_c = createGeofenceDto.radiusKm) === null || _c === void 0 ? void 0 : _c.toString();
                            }
                            else if (createGeofenceDto.type === 'POLYGON') {
                                values.polygon = createGeofenceDto.polygon;
                            }
                            return [4 /*yield*/, db.insert(schemas_1.geofences).values(values).returning()];
                        case 1:
                            geofence = (_d.sent())[0];
                            return [2 /*return*/, this.formatGeofence(geofence)];
                    }
                });
            });
        };
        GeofencesService_1.prototype.findAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                var db, results;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, db
                                    .select()
                                    .from(schemas_1.geofences)
                                    .where((0, drizzle_orm_1.isNull)(schemas_1.geofences.deletedAt))
                                    .orderBy(schemas_1.geofences.createdAt)];
                        case 1:
                            results = _a.sent();
                            return [2 /*return*/, results.map(this.formatGeofence)];
                    }
                });
            });
        };
        GeofencesService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var db, geofence;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, db
                                    .select()
                                    .from(schemas_1.geofences)
                                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.geofences.id, id), (0, drizzle_orm_1.isNull)(schemas_1.geofences.deletedAt)))];
                        case 1:
                            geofence = (_a.sent())[0];
                            if (!geofence) {
                                throw new common_1.NotFoundException("Geofence with ID ".concat(id, " not found"));
                            }
                            return [2 /*return*/, this.formatGeofence(geofence)];
                    }
                });
            });
        };
        GeofencesService_1.prototype.update = function (id, updateGeofenceDto) {
            return __awaiter(this, void 0, void 0, function () {
                var db, values, geofence;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            // Check if exists
                            return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            // Check if exists
                            _a.sent();
                            values = __assign(__assign({}, updateGeofenceDto), { updatedAt: new Date() });
                            if (updateGeofenceDto.centerLatitude !== undefined) {
                                values.centerLatitude = updateGeofenceDto.centerLatitude.toString();
                            }
                            if (updateGeofenceDto.centerLongitude !== undefined) {
                                values.centerLongitude = updateGeofenceDto.centerLongitude.toString();
                            }
                            if (updateGeofenceDto.radiusKm !== undefined) {
                                values.radiusKm = updateGeofenceDto.radiusKm.toString();
                            }
                            return [4 /*yield*/, db
                                    .update(schemas_1.geofences)
                                    .set(values)
                                    .where((0, drizzle_orm_1.eq)(schemas_1.geofences.id, id))
                                    .returning()];
                        case 2:
                            geofence = (_a.sent())[0];
                            return [2 /*return*/, this.formatGeofence(geofence)];
                    }
                });
            });
        };
        GeofencesService_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var db;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            // Check if exists
                            return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            // Check if exists
                            _a.sent();
                            // Soft delete
                            return [4 /*yield*/, db.update(schemas_1.geofences).set({ deletedAt: new Date() }).where((0, drizzle_orm_1.eq)(schemas_1.geofences.id, id))];
                        case 2:
                            // Soft delete
                            _a.sent();
                            return [2 /*return*/, { message: 'Geofence deleted successfully' }];
                    }
                });
            });
        };
        /**
         * Check if a point is within a geofence
         */
        GeofencesService_1.prototype.checkPoint = function (geofenceId, latitude, longitude) {
            return __awaiter(this, void 0, void 0, function () {
                var geofence, isInside;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(geofenceId)];
                        case 1:
                            geofence = _a.sent();
                            isInside = false;
                            if (geofence.type === 'CIRCLE' &&
                                geofence.centerLatitude !== null &&
                                geofence.centerLongitude !== null &&
                                geofence.radiusKm !== null) {
                                isInside = this.mapsService.isPointInCircle(latitude, longitude, geofence.centerLatitude, geofence.centerLongitude, geofence.radiusKm);
                            }
                            else if (geofence.type === 'POLYGON' && geofence.polygon) {
                                isInside = this.mapsService.isPointInPolygon(latitude, longitude, geofence.polygon);
                            }
                            return [2 /*return*/, {
                                    geofenceId: geofence.id,
                                    geofenceName: geofence.name,
                                    isInside: isInside,
                                }];
                    }
                });
            });
        };
        /**
         * Find all geofences that contain a point
         */
        GeofencesService_1.prototype.findGeofencesContainingPoint = function (latitude, longitude) {
            return __awaiter(this, void 0, void 0, function () {
                var allGeofences, containingGeofences, _i, allGeofences_1, geofence, isInside;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findAll()];
                        case 1:
                            allGeofences = _a.sent();
                            containingGeofences = [];
                            for (_i = 0, allGeofences_1 = allGeofences; _i < allGeofences_1.length; _i++) {
                                geofence = allGeofences_1[_i];
                                isInside = false;
                                if (geofence.type === 'CIRCLE' &&
                                    geofence.centerLatitude !== null &&
                                    geofence.centerLongitude !== null &&
                                    geofence.radiusKm !== null) {
                                    isInside = this.mapsService.isPointInCircle(latitude, longitude, geofence.centerLatitude, geofence.centerLongitude, geofence.radiusKm);
                                }
                                else if (geofence.type === 'POLYGON' && geofence.polygon) {
                                    isInside = this.mapsService.isPointInPolygon(latitude, longitude, geofence.polygon);
                                }
                                if (isInside) {
                                    containingGeofences.push(geofence);
                                }
                            }
                            return [2 /*return*/, containingGeofences];
                    }
                });
            });
        };
        /**
         * Format geofence data - convert string coordinates back to numbers
         */
        GeofencesService_1.prototype.formatGeofence = function (geofence) {
            return __assign(__assign({}, geofence), { centerLatitude: geofence.centerLatitude ? parseFloat(geofence.centerLatitude) : null, centerLongitude: geofence.centerLongitude ? parseFloat(geofence.centerLongitude) : null, radiusKm: geofence.radiusKm ? parseFloat(geofence.radiusKm) : null });
        };
        return GeofencesService_1;
    }());
    __setFunctionName(_classThis, "GeofencesService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GeofencesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GeofencesService = _classThis;
}();
exports.GeofencesService = GeofencesService;
