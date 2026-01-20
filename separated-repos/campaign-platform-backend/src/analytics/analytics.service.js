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
exports.AnalyticsService = void 0;
var common_1 = require("@nestjs/common");
var drizzle_orm_1 = require("drizzle-orm");
var schemas_1 = require("../database/schemas");
var AnalyticsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AnalyticsService = _classThis = /** @class */ (function () {
        function AnalyticsService_1(databaseService) {
            this.databaseService = databaseService;
        }
        /**
         * Get comprehensive campaign overview
         */
        AnalyticsService_1.prototype.getCampaignOverview = function () {
            return __awaiter(this, void 0, void 0, function () {
                var db, _a, allVoters, allEvents, allSessions, allDoorKnocks, today, last7Days, last30Days;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, Promise.all([
                                    db.select().from(schemas_1.voters).where((0, drizzle_orm_1.isNull)(schemas_1.voters.deletedAt)),
                                    db.select().from(schemas_1.events).where((0, drizzle_orm_1.isNull)(schemas_1.events.deletedAt)),
                                    db.select().from(schemas_1.canvassingSessions).where((0, drizzle_orm_1.isNull)(schemas_1.canvassingSessions.deletedAt)),
                                    db.select().from(schemas_1.doorKnocks).where((0, drizzle_orm_1.isNull)(schemas_1.doorKnocks.deletedAt)),
                                ])];
                        case 1:
                            _a = _c.sent(), allVoters = _a[0], allEvents = _a[1], allSessions = _a[2], allDoorKnocks = _a[3];
                            today = new Date().toISOString().split('T')[0];
                            last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                            last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                            _b = {
                                summary: {
                                    totalVoters: allVoters.length,
                                    totalEvents: allEvents.length,
                                    totalCanvassingSessions: allSessions.length,
                                    totalDoorKnocks: allDoorKnocks.length,
                                },
                                voters: {
                                    total: allVoters.length,
                                    withEmail: allVoters.filter(function (v) { return v.email; }).length,
                                    withPhone: allVoters.filter(function (v) { return v.phone; }).length,
                                    withWhatsapp: allVoters.filter(function (v) { return v.hasWhatsapp === 'SIM'; }).length,
                                    withCoordinates: allVoters.filter(function (v) { return v.latitude && v.longitude; }).length,
                                    bySupportLevel: this.groupBy(allVoters, 'supportLevel'),
                                    byCity: this.groupBy(allVoters, 'city'),
                                    byGender: this.groupBy(allVoters, 'gender'),
                                    recent: {
                                        last7Days: allVoters.filter(function (v) { return new Date(v.createdAt) >= new Date(last7Days); }).length,
                                        last30Days: allVoters.filter(function (v) { return new Date(v.createdAt) >= new Date(last30Days); }).length,
                                    },
                                },
                                events: {
                                    total: allEvents.length,
                                    upcoming: allEvents.filter(function (e) { return e.startDate >= today && e.status === 'AGENDADO'; }).length,
                                    completed: allEvents.filter(function (e) { return e.status === 'CONCLUIDO'; }).length,
                                    cancelled: allEvents.filter(function (e) { return e.status === 'CANCELADO'; }).length,
                                    byType: this.groupBy(allEvents, 'type'),
                                    byStatus: this.groupBy(allEvents, 'status'),
                                    byVisibility: this.groupBy(allEvents, 'visibility'),
                                    thisMonth: allEvents.filter(function (e) {
                                        var eventDate = new Date(e.startDate);
                                        var now = new Date();
                                        return (eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear());
                                    }).length,
                                },
                                canvassing: {
                                    totalSessions: allSessions.length,
                                    completedSessions: allSessions.filter(function (s) { return s.status === 'CONCLUIDA'; }).length,
                                    inProgressSessions: allSessions.filter(function (s) { return s.status === 'EM_ANDAMENTO'; }).length,
                                    totalDoorKnocks: allDoorKnocks.length,
                                    results: {
                                        supporters: allDoorKnocks.filter(function (d) { return d.result === 'APOIADOR'; }).length,
                                        undecided: allDoorKnocks.filter(function (d) { return d.result === 'INDECISO'; }).length,
                                        opponents: allDoorKnocks.filter(function (d) { return d.result === 'OPOSITOR'; }).length,
                                        notHome: allDoorKnocks.filter(function (d) { return d.result === 'NAO_ATENDEU'; }).length,
                                        refused: allDoorKnocks.filter(function (d) { return d.result === 'RECUSOU_CONTATO'; }).length,
                                    },
                                    byResult: this.groupBy(allDoorKnocks, 'result'),
                                    conversionRate: this.calculateConversionRate(allDoorKnocks),
                                }
                            };
                            return [4 /*yield*/, Promise.all([
                                    this.calculateVoterGrowthTrend(),
                                    this.calculateEventActivityTrend(),
                                    this.calculateCanvassingProgressTrend(),
                                ]).then(function (_a) {
                                    var voterGrowth = _a[0], eventActivity = _a[1], canvassingProgress = _a[2];
                                    return ({
                                        voterGrowth: voterGrowth,
                                        eventActivity: eventActivity,
                                        canvassingProgress: canvassingProgress,
                                    });
                                })];
                        case 2: return [2 /*return*/, (_b.trends = _c.sent(),
                                _b)];
                    }
                });
            });
        };
        /**
         * Get voter analytics
         */
        AnalyticsService_1.prototype.getVoterAnalytics = function () {
            return __awaiter(this, void 0, void 0, function () {
                var db, allVoters;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, db.select().from(schemas_1.voters).where((0, drizzle_orm_1.isNull)(schemas_1.voters.deletedAt))];
                        case 1:
                            allVoters = _a.sent();
                            return [2 /*return*/, {
                                    total: allVoters.length,
                                    demographics: {
                                        byGender: this.groupBy(allVoters, 'gender'),
                                        byEducationLevel: this.groupBy(allVoters, 'educationLevel'),
                                        byIncomeLevel: this.groupBy(allVoters, 'incomeLevel'),
                                        byMaritalStatus: this.groupBy(allVoters, 'maritalStatus'),
                                        byAge: this.calculateAgeDistribution(allVoters),
                                    },
                                    geographic: {
                                        byCity: this.groupBy(allVoters, 'city'),
                                        byNeighborhood: this.groupBy(allVoters, 'neighborhood'),
                                        byState: this.groupBy(allVoters, 'state'),
                                        byElectoralZone: this.groupBy(allVoters, 'electoralZone'),
                                    },
                                    political: {
                                        bySupportLevel: this.groupBy(allVoters, 'supportLevel'),
                                        byPoliticalParty: this.groupBy(allVoters, 'politicalParty'),
                                    },
                                    contact: {
                                        withEmail: allVoters.filter(function (v) { return v.email; }).length,
                                        withPhone: allVoters.filter(function (v) { return v.phone; }).length,
                                        withWhatsapp: allVoters.filter(function (v) { return v.hasWhatsapp === 'SIM'; }).length,
                                        preferredContactMethod: this.groupBy(allVoters, 'preferredContact'),
                                    },
                                    engagement: {
                                        withCoordinates: allVoters.filter(function (v) { return v.latitude && v.longitude; }).length,
                                        withSocialMedia: allVoters.filter(function (v) { return v.facebook || v.instagram || v.twitter; }).length,
                                    },
                                }];
                    }
                });
            });
        };
        /**
         * Get event analytics
         */
        AnalyticsService_1.prototype.getEventAnalytics = function () {
            return __awaiter(this, void 0, void 0, function () {
                var db, allEvents, today;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, db.select().from(schemas_1.events).where((0, drizzle_orm_1.isNull)(schemas_1.events.deletedAt))];
                        case 1:
                            allEvents = _a.sent();
                            today = new Date().toISOString().split('T')[0];
                            return [2 /*return*/, {
                                    total: allEvents.length,
                                    byType: this.groupBy(allEvents, 'type'),
                                    byStatus: this.groupBy(allEvents, 'status'),
                                    byVisibility: this.groupBy(allEvents, 'visibility'),
                                    upcoming: allEvents.filter(function (e) { return e.startDate >= today && e.status === 'AGENDADO'; }).length,
                                    past: allEvents.filter(function (e) { return e.startDate < today; }).length,
                                    completed: allEvents.filter(function (e) { return e.status === 'CONCLUIDO'; }).length,
                                    cancelled: allEvents.filter(function (e) { return e.status === 'CANCELADO'; }).length,
                                    geographic: {
                                        byCity: this.groupBy(allEvents, 'city'),
                                        byState: this.groupBy(allEvents, 'state'),
                                    },
                                    attendance: {
                                        totalExpected: this.sumNumericField(allEvents, 'expectedAttendees'),
                                        totalConfirmed: this.sumNumericField(allEvents, 'confirmedAttendees'),
                                    },
                                    timeline: this.groupEventsByMonth(allEvents),
                                }];
                    }
                });
            });
        };
        /**
         * Get canvassing analytics
         */
        AnalyticsService_1.prototype.getCanvassingAnalytics = function () {
            return __awaiter(this, void 0, void 0, function () {
                var db, _a, allSessions, allDoorKnocks;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, Promise.all([
                                    db.select().from(schemas_1.canvassingSessions).where((0, drizzle_orm_1.isNull)(schemas_1.canvassingSessions.deletedAt)),
                                    db.select().from(schemas_1.doorKnocks).where((0, drizzle_orm_1.isNull)(schemas_1.doorKnocks.deletedAt)),
                                ])];
                        case 1:
                            _a = _b.sent(), allSessions = _a[0], allDoorKnocks = _a[1];
                            return [2 /*return*/, {
                                    sessions: {
                                        total: allSessions.length,
                                        byStatus: this.groupBy(allSessions, 'status'),
                                        completed: allSessions.filter(function (s) { return s.status === 'CONCLUIDA'; }).length,
                                        inProgress: allSessions.filter(function (s) { return s.status === 'EM_ANDAMENTO'; }).length,
                                        planned: allSessions.filter(function (s) { return s.status === 'PLANEJADA'; }).length,
                                        byRegion: this.groupBy(allSessions, 'region'),
                                        byNeighborhood: this.groupBy(allSessions, 'neighborhood'),
                                    },
                                    doorKnocks: {
                                        total: allDoorKnocks.length,
                                        byResult: this.groupBy(allDoorKnocks, 'result'),
                                        supporters: allDoorKnocks.filter(function (d) { return d.result === 'APOIADOR'; }).length,
                                        undecided: allDoorKnocks.filter(function (d) { return d.result === 'INDECISO'; }).length,
                                        opponents: allDoorKnocks.filter(function (d) { return d.result === 'OPOSITOR'; }).length,
                                        notHome: allDoorKnocks.filter(function (d) { return d.result === 'NAO_ATENDEU'; }).length,
                                        refused: allDoorKnocks.filter(function (d) { return d.result === 'RECUSOU_CONTATO'; }).length,
                                        requiresFollowUp: allDoorKnocks.filter(function (d) { return d.followUpRequired; }).length,
                                    },
                                    performance: {
                                        conversionRate: this.calculateConversionRate(allDoorKnocks),
                                        averagePerSession: allSessions.length > 0 ? allDoorKnocks.length / allSessions.length : 0,
                                        successRate: this.calculateSuccessRate(allDoorKnocks),
                                    },
                                }];
                    }
                });
            });
        };
        /**
         * Get geographic heatmap data
         */
        AnalyticsService_1.prototype.getGeographicHeatmap = function () {
            return __awaiter(this, void 0, void 0, function () {
                var db, votersWithCoordinates;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, db
                                    .select()
                                    .from(schemas_1.voters)
                                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.isNull)(schemas_1.voters.deletedAt), (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", " IS NOT NULL"], ["", " IS NOT NULL"])), schemas_1.voters.latitude), (0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["", " IS NOT NULL"], ["", " IS NOT NULL"])), schemas_1.voters.longitude)))];
                        case 1:
                            votersWithCoordinates = _a.sent();
                            return [2 /*return*/, {
                                    points: votersWithCoordinates.map(function (v) { return ({
                                        lat: parseFloat(v.latitude),
                                        lng: parseFloat(v.longitude),
                                        supportLevel: v.supportLevel,
                                        city: v.city,
                                        neighborhood: v.neighborhood,
                                        voterId: v.id,
                                        voterName: v.name,
                                        influencerScore: v.influencerScore,
                                        engagementScore: v.engagementScore,
                                    }); }),
                                    summary: {
                                        total: votersWithCoordinates.length,
                                        bySupportLevel: this.groupBy(votersWithCoordinates, 'supportLevel'),
                                        byCity: this.groupBy(votersWithCoordinates, 'city'),
                                    },
                                }];
                    }
                });
            });
        };
        /**
         * Get time series data
         */
        AnalyticsService_1.prototype.getTimeSeriesData = function (startDate, endDate, metric) {
            return __awaiter(this, void 0, void 0, function () {
                var db, data, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            data = [];
                            _a = metric;
                            switch (_a) {
                                case 'voter-registrations': return [3 /*break*/, 1];
                                case 'events': return [3 /*break*/, 3];
                                case 'canvassing': return [3 /*break*/, 5];
                            }
                            return [3 /*break*/, 7];
                        case 1: return [4 /*yield*/, db
                                .select()
                                .from(schemas_1.voters)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.isNull)(schemas_1.voters.deletedAt), (0, drizzle_orm_1.gte)((0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["DATE(", ")"], ["DATE(", ")"])), schemas_1.voters.createdAt), startDate), (0, drizzle_orm_1.lte)((0, drizzle_orm_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["DATE(", ")"], ["DATE(", ")"])), schemas_1.voters.createdAt), endDate)))];
                        case 2:
                            data = _b.sent();
                            return [3 /*break*/, 7];
                        case 3: return [4 /*yield*/, db
                                .select()
                                .from(schemas_1.events)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.isNull)(schemas_1.events.deletedAt), (0, drizzle_orm_1.gte)(schemas_1.events.startDate, startDate), (0, drizzle_orm_1.lte)(schemas_1.events.startDate, endDate)))];
                        case 4:
                            data = _b.sent();
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, db
                                .select()
                                .from(schemas_1.doorKnocks)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.isNull)(schemas_1.doorKnocks.deletedAt), (0, drizzle_orm_1.gte)((0, drizzle_orm_1.sql)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["DATE(", ")"], ["DATE(", ")"])), schemas_1.doorKnocks.contactedAt), startDate), (0, drizzle_orm_1.lte)((0, drizzle_orm_1.sql)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["DATE(", ")"], ["DATE(", ")"])), schemas_1.doorKnocks.contactedAt), endDate)))];
                        case 6:
                            data = _b.sent();
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/, this.groupByDate(data, metric)];
                    }
                });
            });
        };
        // Helper methods
        AnalyticsService_1.prototype.groupBy = function (items, field) {
            return items.reduce(function (acc, item) {
                var value = item[field] || 'NOT_SPECIFIED';
                acc[value] = (acc[value] || 0) + 1;
                return acc;
            }, {});
        };
        AnalyticsService_1.prototype.calculateAgeDistribution = function (voters) {
            var votersWithAge = voters.filter(function (v) { return v.dateOfBirth; });
            if (votersWithAge.length === 0) {
                return { ageRanges: {}, averageAge: null };
            }
            var ages = votersWithAge.map(function (v) {
                var birthDate = new Date(v.dateOfBirth);
                var today = new Date();
                var age = today.getFullYear() - birthDate.getFullYear();
                var monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age;
            });
            var averageAge = Math.round(ages.reduce(function (a, b) { return a + b; }, 0) / ages.length);
            return {
                ageRanges: {
                    '16-24': ages.filter(function (age) { return age >= 16 && age <= 24; }).length,
                    '25-34': ages.filter(function (age) { return age >= 25 && age <= 34; }).length,
                    '35-44': ages.filter(function (age) { return age >= 35 && age <= 44; }).length,
                    '45-59': ages.filter(function (age) { return age >= 45 && age <= 59; }).length,
                    '60+': ages.filter(function (age) { return age >= 60; }).length,
                },
                averageAge: averageAge,
            };
        };
        AnalyticsService_1.prototype.calculateConversionRate = function (doorKnocks) {
            if (doorKnocks.length === 0)
                return 0;
            var contacted = doorKnocks.filter(function (d) { return d.result !== 'NAO_ATENDEU'; }).length;
            var supporters = doorKnocks.filter(function (d) { return d.result === 'APOIADOR'; }).length;
            return contacted > 0 ? Math.round((supporters / contacted) * 100) : 0;
        };
        AnalyticsService_1.prototype.calculateSuccessRate = function (doorKnocks) {
            if (doorKnocks.length === 0)
                return 0;
            var successful = doorKnocks.filter(function (d) { return d.result === 'APOIADOR' || d.result === 'INDECISO'; }).length;
            return Math.round((successful / doorKnocks.length) * 100);
        };
        AnalyticsService_1.prototype.sumNumericField = function (items, field) {
            return items.reduce(function (sum, item) {
                var value = item[field];
                if (!value)
                    return sum;
                var numeric = parseInt(value.toString().replace(/\D/g, ''));
                return sum + (isNaN(numeric) ? 0 : numeric);
            }, 0);
        };
        AnalyticsService_1.prototype.groupEventsByMonth = function (events) {
            var byMonth = {};
            events.forEach(function (event) {
                var date = new Date(event.startDate);
                var key = "".concat(date.getFullYear(), "-").concat(String(date.getMonth() + 1).padStart(2, '0'));
                byMonth[key] = (byMonth[key] || 0) + 1;
            });
            return byMonth;
        };
        AnalyticsService_1.prototype.groupByDate = function (items, type) {
            var byDate = {};
            var dateField = type === 'voter-registrations'
                ? 'createdAt'
                : type === 'events'
                    ? 'startDate'
                    : 'contactedAt';
            items.forEach(function (item) {
                var date = new Date(item[dateField]);
                var key = date.toISOString().split('T')[0];
                byDate[key] = (byDate[key] || 0) + 1;
            });
            return Object.entries(byDate)
                .map(function (_a) {
                var date = _a[0], count = _a[1];
                return ({ date: date, count: count });
            })
                .sort(function (a, b) { return a.date.localeCompare(b.date); });
        };
        AnalyticsService_1.prototype.calculateVoterGrowthTrend = function () {
            return __awaiter(this, void 0, void 0, function () {
                var db, last30Days, recentVoters;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                            return [4 /*yield*/, db
                                    .select()
                                    .from(schemas_1.voters)
                                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.isNull)(schemas_1.voters.deletedAt), (0, drizzle_orm_1.gte)((0, drizzle_orm_1.sql)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["DATE(", ")"], ["DATE(", ")"])), schemas_1.voters.createdAt), last30Days)))];
                        case 1:
                            recentVoters = _a.sent();
                            return [2 /*return*/, this.groupByDate(recentVoters, 'voter-registrations')];
                    }
                });
            });
        };
        AnalyticsService_1.prototype.calculateEventActivityTrend = function () {
            return __awaiter(this, void 0, void 0, function () {
                var db, last30Days, recentEvents;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                            return [4 /*yield*/, db
                                    .select()
                                    .from(schemas_1.events)
                                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.isNull)(schemas_1.events.deletedAt), (0, drizzle_orm_1.gte)(schemas_1.events.startDate, last30Days)))];
                        case 1:
                            recentEvents = _a.sent();
                            return [2 /*return*/, this.groupByDate(recentEvents, 'events')];
                    }
                });
            });
        };
        AnalyticsService_1.prototype.calculateCanvassingProgressTrend = function () {
            return __awaiter(this, void 0, void 0, function () {
                var db, last30Days, recentDoorKnocks;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                            return [4 /*yield*/, db
                                    .select()
                                    .from(schemas_1.doorKnocks)
                                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.isNull)(schemas_1.doorKnocks.deletedAt), (0, drizzle_orm_1.gte)((0, drizzle_orm_1.sql)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["DATE(", ")"], ["DATE(", ")"])), schemas_1.doorKnocks.contactedAt), last30Days)))];
                        case 1:
                            recentDoorKnocks = _a.sent();
                            return [2 /*return*/, this.groupByDate(recentDoorKnocks, 'canvassing')];
                    }
                });
            });
        };
        return AnalyticsService_1;
    }());
    __setFunctionName(_classThis, "AnalyticsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AnalyticsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AnalyticsService = _classThis;
}();
exports.AnalyticsService = AnalyticsService;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
