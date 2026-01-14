"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.CalendarService = void 0;
var common_1 = require("@nestjs/common");
var drizzle_orm_1 = require("drizzle-orm");
var schemas_1 = require("../database/schemas");
var CalendarService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CalendarService = _classThis = /** @class */ (function () {
        function CalendarService_1(databaseService) {
            this.databaseService = databaseService;
        }
        CalendarService_1.prototype.create = function (createEventDto) {
            return __awaiter(this, void 0, void 0, function () {
                var db, conflicts, event;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, this.checkConflicts(createEventDto.startDate, createEventDto.startTime, createEventDto.endDate, createEventDto.endTime)];
                        case 1:
                            conflicts = _a.sent();
                            if (conflicts.length > 0) {
                                throw new common_1.ConflictException({
                                    message: 'Event conflicts with existing events',
                                    conflicts: conflicts.map(function (c) { return ({
                                        id: c.id,
                                        title: c.title,
                                        startDate: c.startDate,
                                        startTime: c.startTime,
                                        endDate: c.endDate,
                                        endTime: c.endTime,
                                    }); }),
                                });
                            }
                            return [4 /*yield*/, db
                                    .insert(schemas_1.events)
                                    .values(createEventDto)
                                    .returning()];
                        case 2:
                            event = (_a.sent())[0];
                            return [2 /*return*/, event];
                    }
                });
            });
        };
        CalendarService_1.prototype.findAll = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var db, _a, page, _b, limit, offset, conditions, searchCondition, _c, countResult, results, count;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            _a = query.page, page = _a === void 0 ? 1 : _a, _b = query.limit, limit = _b === void 0 ? 10 : _b;
                            offset = (page - 1) * limit;
                            conditions = [(0, drizzle_orm_1.isNull)(schemas_1.events.deletedAt)];
                            // Search by title or location
                            if (query.search) {
                                searchCondition = (0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schemas_1.events.title, "%".concat(query.search, "%")), (0, drizzle_orm_1.ilike)(schemas_1.events.location, "%".concat(query.search, "%")));
                                if (searchCondition) {
                                    conditions.push(searchCondition);
                                }
                            }
                            // Filter by type
                            if (query.type) {
                                conditions.push((0, drizzle_orm_1.eq)(schemas_1.events.type, query.type));
                            }
                            // Filter by status
                            if (query.status) {
                                conditions.push((0, drizzle_orm_1.eq)(schemas_1.events.status, query.status));
                            }
                            // Filter by visibility
                            if (query.visibility) {
                                conditions.push((0, drizzle_orm_1.eq)(schemas_1.events.visibility, query.visibility));
                            }
                            // Filter by date range
                            if (query.startDateFrom) {
                                conditions.push((0, drizzle_orm_1.gte)(schemas_1.events.startDate, query.startDateFrom));
                            }
                            if (query.startDateTo) {
                                conditions.push((0, drizzle_orm_1.lte)(schemas_1.events.startDate, query.startDateTo));
                            }
                            // Filter by city
                            if (query.city) {
                                conditions.push((0, drizzle_orm_1.eq)(schemas_1.events.city, query.city));
                            }
                            return [4 /*yield*/, Promise.all([
                                    db
                                        .select({ count: (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["count(*)::int"], ["count(*)::int"]))) })
                                        .from(schemas_1.events)
                                        .where(drizzle_orm_1.and.apply(void 0, conditions)),
                                    db
                                        .select()
                                        .from(schemas_1.events)
                                        .where(drizzle_orm_1.and.apply(void 0, conditions))
                                        .limit(limit)
                                        .offset(offset)
                                        .orderBy(schemas_1.events.startDate, schemas_1.events.startTime),
                                ])];
                        case 1:
                            _c = _d.sent(), countResult = _c[0], results = _c[1];
                            count = countResult[0].count;
                            return [2 /*return*/, {
                                    data: results,
                                    meta: {
                                        total: count,
                                        page: page,
                                        limit: limit,
                                        totalPages: Math.ceil(count / limit),
                                    },
                                }];
                    }
                });
            });
        };
        CalendarService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var db, event;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, db
                                    .select()
                                    .from(schemas_1.events)
                                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.events.id, id), (0, drizzle_orm_1.isNull)(schemas_1.events.deletedAt)))];
                        case 1:
                            event = (_a.sent())[0];
                            if (!event) {
                                throw new common_1.NotFoundException("Event with ID ".concat(id, " not found"));
                            }
                            return [2 /*return*/, event];
                    }
                });
            });
        };
        CalendarService_1.prototype.update = function (id, updateEventDto) {
            return __awaiter(this, void 0, void 0, function () {
                var db, existingEvent, conflicts, event;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            existingEvent = _a.sent();
                            if (!(updateEventDto.startDate ||
                                updateEventDto.startTime ||
                                updateEventDto.endDate ||
                                updateEventDto.endTime)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.checkConflicts(updateEventDto.startDate || existingEvent.startDate, updateEventDto.startTime || existingEvent.startTime, updateEventDto.endDate || existingEvent.endDate, updateEventDto.endTime || existingEvent.endTime, id)];
                        case 2:
                            conflicts = _a.sent();
                            if (conflicts.length > 0) {
                                throw new common_1.ConflictException({
                                    message: 'Event update would create conflicts with existing events',
                                    conflicts: conflicts.map(function (c) { return ({
                                        id: c.id,
                                        title: c.title,
                                        startDate: c.startDate,
                                        startTime: c.startTime,
                                        endDate: c.endDate,
                                        endTime: c.endTime,
                                    }); }),
                                });
                            }
                            _a.label = 3;
                        case 3: return [4 /*yield*/, db
                                .update(schemas_1.events)
                                .set(__assign(__assign({}, updateEventDto), { updatedAt: new Date() }))
                                .where((0, drizzle_orm_1.eq)(schemas_1.events.id, id))
                                .returning()];
                        case 4:
                            event = (_a.sent())[0];
                            return [2 /*return*/, event];
                    }
                });
            });
        };
        CalendarService_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var db;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            // Check if event exists
                            return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            // Check if event exists
                            _a.sent();
                            // Soft delete
                            return [4 /*yield*/, db.update(schemas_1.events).set({ deletedAt: new Date() }).where((0, drizzle_orm_1.eq)(schemas_1.events.id, id))];
                        case 2:
                            // Soft delete
                            _a.sent();
                            return [2 /*return*/, { message: 'Event deleted successfully' }];
                    }
                });
            });
        };
        /**
         * Check for scheduling conflicts
         */
        CalendarService_1.prototype.checkConflicts = function (startDate, startTime, endDate, endTime, excludeEventId) {
            return __awaiter(this, void 0, void 0, function () {
                var db, conditions, allEvents, conflicts;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            conditions = [(0, drizzle_orm_1.isNull)(schemas_1.events.deletedAt)];
                            // Exclude specific event if provided (for updates)
                            if (excludeEventId) {
                                conditions.push((0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["", " != ", ""], ["", " != ", ""])), schemas_1.events.id, excludeEventId));
                            }
                            return [4 /*yield*/, db
                                    .select()
                                    .from(schemas_1.events)
                                    .where(drizzle_orm_1.and.apply(void 0, conditions))];
                        case 1:
                            allEvents = _a.sent();
                            conflicts = allEvents.filter(function (event) {
                                var newStart = new Date("".concat(startDate, "T").concat(startTime));
                                var newEnd = new Date("".concat(endDate, "T").concat(endTime));
                                var existingStart = new Date("".concat(event.startDate, "T").concat(event.startTime));
                                var existingEnd = new Date("".concat(event.endDate, "T").concat(event.endTime));
                                // Check if there's an overlap
                                return ((newStart >= existingStart && newStart < existingEnd) || // New starts during existing
                                    (newEnd > existingStart && newEnd <= existingEnd) || // New ends during existing
                                    (newStart <= existingStart && newEnd >= existingEnd) // New encompasses existing
                                );
                            });
                            return [2 /*return*/, conflicts];
                    }
                });
            });
        };
        /**
         * Get events for a specific date range
         */
        CalendarService_1.prototype.getEventsByDateRange = function (startDate, endDate) {
            return __awaiter(this, void 0, void 0, function () {
                var db, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, db
                                    .select()
                                    .from(schemas_1.events)
                                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.isNull)(schemas_1.events.deletedAt), (0, drizzle_orm_1.gte)(schemas_1.events.startDate, startDate), (0, drizzle_orm_1.lte)(schemas_1.events.endDate, endDate)))
                                    .orderBy(schemas_1.events.startDate, schemas_1.events.startTime)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        /**
         * Get upcoming events
         */
        CalendarService_1.prototype.getUpcomingEvents = function () {
            return __awaiter(this, arguments, void 0, function (limit) {
                var db, today, upcomingEvents;
                if (limit === void 0) { limit = 10; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            today = new Date().toISOString().split('T')[0];
                            return [4 /*yield*/, db
                                    .select()
                                    .from(schemas_1.events)
                                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.isNull)(schemas_1.events.deletedAt), (0, drizzle_orm_1.gte)(schemas_1.events.startDate, today), (0, drizzle_orm_1.eq)(schemas_1.events.status, 'AGENDADO')))
                                    .orderBy(schemas_1.events.startDate, schemas_1.events.startTime)
                                    .limit(limit)];
                        case 1:
                            upcomingEvents = _a.sent();
                            return [2 /*return*/, upcomingEvents];
                    }
                });
            });
        };
        /**
         * Get event statistics
         */
        CalendarService_1.prototype.getStatistics = function () {
            return __awaiter(this, void 0, void 0, function () {
                var db, allEvents, now, today, dayOfWeek, weekStart, weekEnd, weekStartStr, weekEndStr, normalizeDate, stats;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, db.select().from(schemas_1.events).where((0, drizzle_orm_1.isNull)(schemas_1.events.deletedAt))];
                        case 1:
                            allEvents = _a.sent();
                            now = new Date();
                            today = now.toISOString().split('T')[0];
                            dayOfWeek = now.getDay();
                            weekStart = new Date(now);
                            weekStart.setDate(now.getDate() - dayOfWeek);
                            weekStart.setHours(0, 0, 0, 0);
                            weekEnd = new Date(weekStart);
                            weekEnd.setDate(weekStart.getDate() + 6);
                            weekEnd.setHours(23, 59, 59, 999);
                            weekStartStr = weekStart.toISOString().split('T')[0];
                            weekEndStr = weekEnd.toISOString().split('T')[0];
                            normalizeDate = function (dateValue) {
                                if (!dateValue)
                                    return '';
                                var dateStr = typeof dateValue === 'string' ? dateValue : dateValue.toISOString();
                                return dateStr.split('T')[0];
                            };
                            stats = {
                                total: allEvents.length,
                                byType: this.groupBy(allEvents, 'type'),
                                byStatus: this.groupBy(allEvents, 'status'),
                                byVisibility: this.groupBy(allEvents, 'visibility'),
                                upcoming: allEvents.filter(function (e) { return normalizeDate(e.startDate) >= today && e.status === 'AGENDADO'; }).length,
                                completed: allEvents.filter(function (e) { return e.status === 'CONCLUIDO'; }).length,
                                cancelled: allEvents.filter(function (e) { return e.status === 'CANCELADO'; }).length,
                                today: allEvents.filter(function (e) { return normalizeDate(e.startDate) === today; }).length,
                                thisWeek: allEvents.filter(function (e) {
                                    var eventDate = normalizeDate(e.startDate);
                                    return eventDate >= weekStartStr && eventDate <= weekEndStr;
                                }).length,
                                thisMonth: allEvents.filter(function (e) {
                                    var eventDateStr = normalizeDate(e.startDate);
                                    var eventDate = new Date(eventDateStr);
                                    return (eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear());
                                }).length,
                            };
                            return [2 /*return*/, stats];
                    }
                });
            });
        };
        /**
         * Helper: Group events by a field
         */
        CalendarService_1.prototype.groupBy = function (events, field) {
            return events.reduce(function (acc, event) {
                var value = event[field] || 'NOT_SPECIFIED';
                acc[value] = (acc[value] || 0) + 1;
                return acc;
            }, {});
        };
        return CalendarService_1;
    }());
    __setFunctionName(_classThis, "CalendarService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CalendarService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CalendarService = _classThis;
}();
exports.CalendarService = CalendarService;
var templateObject_1, templateObject_2;
