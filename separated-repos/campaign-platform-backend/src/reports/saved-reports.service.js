"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.SavedReportsService = void 0;
var common_1 = require("@nestjs/common");
var drizzle_orm_1 = require("drizzle-orm");
var saved_report_schema_1 = require("../database/schemas/saved-report.schema");
/**
 * SavedReports Service
 *
 * Handles CRUD operations for saved reports.
 * Includes soft delete, search, filtering, and usage tracking.
 */
var SavedReportsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SavedReportsService = _classThis = /** @class */ (function () {
        function SavedReportsService_1(databaseService) {
            this.databaseService = databaseService;
        }
        /**
         * Create a new saved report
         */
        SavedReportsService_1.prototype.create = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var db, newReport, report;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            newReport = {
                                createdBy: null, // TODO: Set to userId when users table is populated (Phase 10)
                                name: dto.name,
                                description: dto.description,
                                filters: dto.filters,
                                sorting: dto.sorting,
                                columns: dto.columns,
                                isPublic: (_a = dto.isPublic) !== null && _a !== void 0 ? _a : false,
                                usageCount: 0,
                            };
                            return [4 /*yield*/, db.insert(saved_report_schema_1.savedReports).values(newReport).returning()];
                        case 1:
                            report = (_b.sent())[0];
                            return [2 /*return*/, report];
                    }
                });
            });
        };
        /**
         * Find all saved reports for a user
         */
        SavedReportsService_1.prototype.findAll = function (userId, filters) {
            return __awaiter(this, void 0, void 0, function () {
                var db, _a, page, _b, perPage, search, isPublic, whereConditions, _c, data, countResult, total;
                var _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            _a = filters.page, page = _a === void 0 ? 1 : _a, _b = filters.perPage, perPage = _b === void 0 ? 20 : _b, search = filters.search, isPublic = filters.isPublic;
                            whereConditions = [(0, drizzle_orm_1.isNull)(saved_report_schema_1.savedReports.deletedAt)];
                            if (search) {
                                whereConditions.push((0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["(", " ILIKE ", " OR ", " ILIKE ", ")"], ["(", " ILIKE ", " OR ", " ILIKE ", ")"])), saved_report_schema_1.savedReports.name, "%".concat(search, "%"), saved_report_schema_1.savedReports.description, "%".concat(search, "%")));
                            }
                            if (isPublic !== undefined) {
                                whereConditions.push((0, drizzle_orm_1.eq)(saved_report_schema_1.savedReports.isPublic, isPublic));
                            }
                            return [4 /*yield*/, Promise.all([
                                    db
                                        .select()
                                        .from(saved_report_schema_1.savedReports)
                                        .where(drizzle_orm_1.and.apply(void 0, whereConditions))
                                        .orderBy((0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["", " DESC"], ["", " DESC"])), saved_report_schema_1.savedReports.updatedAt))
                                        .limit(perPage)
                                        .offset((page - 1) * perPage),
                                    db
                                        .select({ count: (0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["count(*)::int"], ["count(*)::int"]))) })
                                        .from(saved_report_schema_1.savedReports)
                                        .where(drizzle_orm_1.and.apply(void 0, whereConditions)),
                                ])];
                        case 1:
                            _c = _e.sent(), data = _c[0], countResult = _c[1];
                            total = ((_d = countResult[0]) === null || _d === void 0 ? void 0 : _d.count) || 0;
                            return [2 /*return*/, {
                                    data: data,
                                    meta: {
                                        page: page,
                                        perPage: perPage,
                                        total: total,
                                        totalPages: Math.ceil(total / perPage),
                                    },
                                }];
                    }
                });
            });
        };
        /**
         * Find one saved report by ID
         */
        SavedReportsService_1.prototype.findOne = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var db, report;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, db
                                    .select()
                                    .from(saved_report_schema_1.savedReports)
                                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(saved_report_schema_1.savedReports.id, id), (0, drizzle_orm_1.isNull)(saved_report_schema_1.savedReports.deletedAt)))];
                        case 1:
                            report = (_a.sent())[0];
                            if (!report) {
                                throw new common_1.NotFoundException("Report #".concat(id, " not found"));
                            }
                            return [2 /*return*/, report];
                    }
                });
            });
        };
        /**
         * Update a saved report
         */
        SavedReportsService_1.prototype.update = function (id, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var db, updateData, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            // Verify report exists
                            return [4 /*yield*/, this.findOne(id, userId)];
                        case 1:
                            // Verify report exists
                            _a.sent();
                            updateData = {
                                updatedAt: new Date(),
                            };
                            if (dto.name !== undefined)
                                updateData.name = dto.name;
                            if (dto.description !== undefined)
                                updateData.description = dto.description;
                            if (dto.filters !== undefined)
                                updateData.filters = dto.filters;
                            if (dto.sorting !== undefined)
                                updateData.sorting = dto.sorting;
                            if (dto.columns !== undefined)
                                updateData.columns = dto.columns;
                            if (dto.isPublic !== undefined)
                                updateData.isPublic = dto.isPublic;
                            return [4 /*yield*/, db
                                    .update(saved_report_schema_1.savedReports)
                                    .set(updateData)
                                    .where((0, drizzle_orm_1.eq)(saved_report_schema_1.savedReports.id, id))
                                    .returning()];
                        case 2:
                            updated = (_a.sent())[0];
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        /**
         * Soft delete a saved report
         */
        SavedReportsService_1.prototype.remove = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var db;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            // Verify report exists
                            return [4 /*yield*/, this.findOne(id, userId)];
                        case 1:
                            // Verify report exists
                            _a.sent();
                            return [4 /*yield*/, db.update(saved_report_schema_1.savedReports).set({ deletedAt: new Date() }).where((0, drizzle_orm_1.eq)(saved_report_schema_1.savedReports.id, id))];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Increment usage count for a report
         */
        SavedReportsService_1.prototype.incrementUsageCount = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var db;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            // Verify report exists
                            return [4 /*yield*/, this.findOne(id, userId)];
                        case 1:
                            // Verify report exists
                            _a.sent();
                            return [4 /*yield*/, db
                                    .update(saved_report_schema_1.savedReports)
                                    .set({
                                    usageCount: (0, drizzle_orm_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["", " + 1"], ["", " + 1"])), saved_report_schema_1.savedReports.usageCount),
                                    lastUsedAt: new Date(),
                                })
                                    .where((0, drizzle_orm_1.eq)(saved_report_schema_1.savedReports.id, id))];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get report statistics for a user
         */
        SavedReportsService_1.prototype.getStatistics = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var db, result;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, db
                                    .select({
                                    total: (0, drizzle_orm_1.sql)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["count(*)::int"], ["count(*)::int"]))),
                                    totalUsage: (0, drizzle_orm_1.sql)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["sum(", ")::int"], ["sum(", ")::int"])), saved_report_schema_1.savedReports.usageCount),
                                })
                                    .from(saved_report_schema_1.savedReports)
                                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(saved_report_schema_1.savedReports.createdBy, userId), (0, drizzle_orm_1.isNull)(saved_report_schema_1.savedReports.deletedAt)))];
                        case 1:
                            result = _c.sent();
                            return [2 /*return*/, {
                                    total: ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
                                    totalUsage: ((_b = result[0]) === null || _b === void 0 ? void 0 : _b.totalUsage) || 0,
                                }];
                    }
                });
            });
        };
        /**
         * Get most used reports
         */
        SavedReportsService_1.prototype.getMostUsed = function (userId_1) {
            return __awaiter(this, arguments, void 0, function (userId, limit) {
                var db;
                if (limit === void 0) { limit = 5; }
                return __generator(this, function (_a) {
                    db = this.databaseService.getDb();
                    return [2 /*return*/, db
                            .select()
                            .from(saved_report_schema_1.savedReports)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(saved_report_schema_1.savedReports.createdBy, userId), (0, drizzle_orm_1.isNull)(saved_report_schema_1.savedReports.deletedAt)))
                            .orderBy((0, drizzle_orm_1.sql)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["", " DESC"], ["", " DESC"])), saved_report_schema_1.savedReports.usageCount))
                            .limit(limit)];
                });
            });
        };
        /**
         * Get recently used reports
         */
        SavedReportsService_1.prototype.getRecentlyUsed = function (userId_1) {
            return __awaiter(this, arguments, void 0, function (userId, limit) {
                var db;
                if (limit === void 0) { limit = 5; }
                return __generator(this, function (_a) {
                    db = this.databaseService.getDb();
                    return [2 /*return*/, db
                            .select()
                            .from(saved_report_schema_1.savedReports)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(saved_report_schema_1.savedReports.createdBy, userId), (0, drizzle_orm_1.isNull)(saved_report_schema_1.savedReports.deletedAt), (0, drizzle_orm_1.sql)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["", " IS NOT NULL"], ["", " IS NOT NULL"])), saved_report_schema_1.savedReports.lastUsedAt)))
                            .orderBy((0, drizzle_orm_1.sql)(templateObject_9 || (templateObject_9 = __makeTemplateObject(["", " DESC"], ["", " DESC"])), saved_report_schema_1.savedReports.lastUsedAt))
                            .limit(limit)];
                });
            });
        };
        return SavedReportsService_1;
    }());
    __setFunctionName(_classThis, "SavedReportsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SavedReportsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SavedReportsService = _classThis;
}();
exports.SavedReportsService = SavedReportsService;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
