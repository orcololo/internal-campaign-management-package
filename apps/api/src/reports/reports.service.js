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
exports.ReportsService = void 0;
var common_1 = require("@nestjs/common");
var drizzle_orm_1 = require("drizzle-orm");
var voter_schema_1 = require("../database/schemas/voter.schema");
/**
 * Reports Service
 *
 * Executes reports by applying filters and sorts to voter data.
 * Uses QueryBuilder to convert report config into SQL queries.
 */
var ReportsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ReportsService = _classThis = /** @class */ (function () {
        function ReportsService_1(databaseService, queryBuilder, savedReportsService) {
            this.databaseService = databaseService;
            this.queryBuilder = queryBuilder;
            this.savedReportsService = savedReportsService;
        }
        /**
         * Execute a report and return all data
         */
        ReportsService_1.prototype.executeReport = function (reportId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var db, report, whereClause, orderByClause, selectClause, query, softDeleteCondition, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, this.savedReportsService.findOne(reportId, userId)];
                        case 1:
                            report = _a.sent();
                            // Increment usage count
                            return [4 /*yield*/, this.savedReportsService.incrementUsageCount(reportId, userId)];
                        case 2:
                            // Increment usage count
                            _a.sent();
                            whereClause = this.queryBuilder.buildWhereClause(report.filters || []);
                            orderByClause = this.queryBuilder.buildOrderByClause(report.sorting || []);
                            selectClause = this.queryBuilder.buildSelectClause(report.columns);
                            query = selectClause ? db.select(selectClause).from(voter_schema_1.voters) : db.select().from(voter_schema_1.voters);
                            softDeleteCondition = (0, drizzle_orm_1.isNull)(voter_schema_1.voters.deletedAt);
                            // Apply WHERE clause
                            if (whereClause) {
                                query = query.where((0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", " AND ", ""], ["", " AND ", ""])), whereClause, softDeleteCondition));
                            }
                            else {
                                query = query.where(softDeleteCondition);
                            }
                            // Apply ORDER BY clause
                            if (orderByClause.length > 0) {
                                query = query.orderBy.apply(query, orderByClause);
                            }
                            return [4 /*yield*/, query];
                        case 3:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    report: {
                                        id: report.id,
                                        name: report.name,
                                        description: report.description,
                                    },
                                    data: data,
                                    meta: {
                                        total: data.length,
                                        executedAt: new Date().toISOString(),
                                    },
                                }];
                    }
                });
            });
        };
        /**
         * Preview report data with pagination
         */
        ReportsService_1.prototype.previewReport = function (reportId, userId, previewDto) {
            return __awaiter(this, void 0, void 0, function () {
                var db, _a, page, _b, perPage, report, whereClause, orderByClause, selectClause, dataQuery, softDeleteCondition, countQuery, _c, data, countResult, total;
                var _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            _a = previewDto.page, page = _a === void 0 ? 1 : _a, _b = previewDto.perPage, perPage = _b === void 0 ? 50 : _b;
                            return [4 /*yield*/, this.savedReportsService.findOne(reportId, userId)];
                        case 1:
                            report = _e.sent();
                            whereClause = this.queryBuilder.buildWhereClause(report.filters || []);
                            orderByClause = this.queryBuilder.buildOrderByClause(report.sorting || []);
                            selectClause = this.queryBuilder.buildSelectClause(report.columns);
                            dataQuery = selectClause ? db.select(selectClause).from(voter_schema_1.voters) : db.select().from(voter_schema_1.voters);
                            softDeleteCondition = (0, drizzle_orm_1.isNull)(voter_schema_1.voters.deletedAt);
                            // Apply WHERE clause
                            if (whereClause) {
                                dataQuery = dataQuery.where((0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["", " AND ", ""], ["", " AND ", ""])), whereClause, softDeleteCondition));
                            }
                            else {
                                dataQuery = dataQuery.where(softDeleteCondition);
                            }
                            // Apply ORDER BY clause
                            if (orderByClause.length > 0) {
                                dataQuery = dataQuery.orderBy.apply(dataQuery, orderByClause);
                            }
                            // Apply pagination
                            dataQuery = dataQuery.limit(perPage).offset((page - 1) * perPage);
                            countQuery = db.select({ count: (0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["count(*)::int"], ["count(*)::int"]))) }).from(voter_schema_1.voters);
                            if (whereClause) {
                                countQuery = countQuery.where((0, drizzle_orm_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["", " AND ", ""], ["", " AND ", ""])), whereClause, softDeleteCondition));
                            }
                            else {
                                countQuery = countQuery.where(softDeleteCondition);
                            }
                            return [4 /*yield*/, Promise.all([dataQuery, countQuery])];
                        case 2:
                            _c = _e.sent(), data = _c[0], countResult = _c[1];
                            total = ((_d = countResult[0]) === null || _d === void 0 ? void 0 : _d.count) || 0;
                            return [2 /*return*/, {
                                    report: {
                                        id: report.id,
                                        name: report.name,
                                        description: report.description,
                                    },
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
         * Get report summary statistics
         */
        ReportsService_1.prototype.getReportSummary = function (reportId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var db, report, whereClause, softDeleteCondition, query, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, this.savedReportsService.findOne(reportId, userId)];
                        case 1:
                            report = _a.sent();
                            whereClause = this.queryBuilder.buildWhereClause(report.filters || []);
                            softDeleteCondition = (0, drizzle_orm_1.isNull)(voter_schema_1.voters.deletedAt);
                            query = db
                                .select({
                                total: (0, drizzle_orm_1.sql)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["count(*)::int"], ["count(*)::int"]))),
                                supportLevelBreakdown: (0, drizzle_orm_1.sql)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n          jsonb_object_agg(\n            COALESCE(", ", 'NAO_DEFINIDO'),\n            count(*)\n          )\n        "], ["\n          jsonb_object_agg(\n            COALESCE(", ", 'NAO_DEFINIDO'),\n            count(*)\n          )\n        "])), voter_schema_1.voters.supportLevel),
                                cityBreakdown: (0, drizzle_orm_1.sql)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n          jsonb_object_agg(\n            COALESCE(", ", 'NAO_INFORMADO'),\n            count(*)\n          )\n        "], ["\n          jsonb_object_agg(\n            COALESCE(", ", 'NAO_INFORMADO'),\n            count(*)\n          )\n        "])), voter_schema_1.voters.city),
                            })
                                .from(voter_schema_1.voters);
                            if (whereClause) {
                                query = query.where((0, drizzle_orm_1.sql)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["", " AND ", ""], ["", " AND ", ""])), whereClause, softDeleteCondition));
                            }
                            else {
                                query = query.where(softDeleteCondition);
                            }
                            return [4 /*yield*/, query];
                        case 2:
                            result = (_a.sent())[0];
                            return [2 /*return*/, {
                                    report: {
                                        id: report.id,
                                        name: report.name,
                                        description: report.description,
                                    },
                                    summary: {
                                        total: (result === null || result === void 0 ? void 0 : result.total) || 0,
                                        supportLevelBreakdown: (result === null || result === void 0 ? void 0 : result.supportLevelBreakdown) || {},
                                        cityBreakdown: (result === null || result === void 0 ? void 0 : result.cityBreakdown) || {},
                                    },
                                }];
                    }
                });
            });
        };
        /**
         * Validate report filters
         */
        ReportsService_1.prototype.validateReport = function (report) {
            return __awaiter(this, void 0, void 0, function () {
                var errors, _i, _a, filter, _b, _c, sort, _d, _e, column;
                return __generator(this, function (_f) {
                    errors = [];
                    // Validate filters
                    if (report.filters) {
                        for (_i = 0, _a = report.filters; _i < _a.length; _i++) {
                            filter = _a[_i];
                            if (!this.queryBuilder.isValidField(filter.field)) {
                                errors.push("Invalid filter field: ".concat(filter.field));
                            }
                        }
                    }
                    // Validate sort
                    if (report.sorting) {
                        for (_b = 0, _c = report.sorting; _b < _c.length; _b++) {
                            sort = _c[_b];
                            if (!this.queryBuilder.isValidField(sort.field)) {
                                errors.push("Invalid sort field: ".concat(sort.field));
                            }
                        }
                    }
                    // Validate columns
                    if (report.columns) {
                        for (_d = 0, _e = report.columns; _d < _e.length; _d++) {
                            column = _e[_d];
                            if (!this.queryBuilder.isValidField(column)) {
                                errors.push("Invalid column: ".concat(column));
                            }
                        }
                    }
                    return [2 /*return*/, {
                            valid: errors.length === 0,
                            errors: errors,
                        }];
                });
            });
        };
        return ReportsService_1;
    }());
    __setFunctionName(_classThis, "ReportsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReportsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReportsService = _classThis;
}();
exports.ReportsService = ReportsService;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
