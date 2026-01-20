"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VotersController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var referral_dto_1 = require("./dto/referral.dto");
var roles_decorator_1 = require("../common/decorators/roles.decorator");
var roles_guard_1 = require("../common/guards/roles.guard");
var VotersController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Voters'), (0, common_1.Controller)('voters'), (0, common_1.UseGuards)(roles_guard_1.RolesGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findAll_decorators;
    var _getStatistics_decorators;
    var _findOne_decorators;
    var _update_decorators;
    var _remove_decorators;
    var _bulkDelete_decorators;
    var _bulkUpdate_decorators;
    var _geocode_decorators;
    var _findNearby_decorators;
    var _findInGeofence_decorators;
    var _groupByProximity_decorators;
    var _batchGeocode_decorators;
    var _importCsv_decorators;
    var _exportCsv_decorators;
    var _getReferrals_decorators;
    var _getReferralStats_decorators;
    var _generateReferralCode_decorators;
    var _registerReferral_decorators;
    var VotersController = _classThis = /** @class */ (function () {
        function VotersController_1(votersService) {
            this.votersService = (__runInitializers(this, _instanceExtraInitializers), votersService);
        }
        VotersController_1.prototype.create = function (createVoterDto) {
            return this.votersService.create(createVoterDto);
        };
        VotersController_1.prototype.findAll = function (query) {
            return this.votersService.findAll(query);
        };
        VotersController_1.prototype.getStatistics = function () {
            return this.votersService.getStatistics();
        };
        VotersController_1.prototype.findOne = function (id) {
            return this.votersService.findOne(id);
        };
        VotersController_1.prototype.update = function (id, updateVoterDto) {
            return this.votersService.update(id, updateVoterDto);
        };
        VotersController_1.prototype.remove = function (id) {
            return this.votersService.remove(id);
        };
        // Bulk operations
        VotersController_1.prototype.bulkDelete = function (bulkDeleteDto) {
            return this.votersService.bulkDelete(bulkDeleteDto.ids);
        };
        VotersController_1.prototype.bulkUpdate = function (bulkUpdateDto) {
            return this.votersService.bulkUpdate(bulkUpdateDto.updates);
        };
        // Location-based endpoints
        VotersController_1.prototype.geocode = function (id) {
            return this.votersService.geocodeVoter(id);
        };
        VotersController_1.prototype.findNearby = function (lat, lng, radius, limit) {
            return this.votersService.findNearLocation(parseFloat(lat), parseFloat(lng), parseFloat(radius), limit ? parseInt(limit) : 50);
        };
        VotersController_1.prototype.findInGeofence = function (body) {
            return this.votersService.findInGeofence(body.type, body.data);
        };
        VotersController_1.prototype.groupByProximity = function (body) {
            return this.votersService.groupByProximity(body.locations, body.maxDistanceKm || 5);
        };
        VotersController_1.prototype.batchGeocode = function (limit) {
            return this.votersService.batchGeocodeVoters(limit ? parseInt(limit) : 10);
        };
        // Import/Export endpoints
        VotersController_1.prototype.importCsv = function (file, importDto) {
            return __awaiter(this, void 0, void 0, function () {
                var csvContent;
                return __generator(this, function (_a) {
                    if (!file) {
                        throw new common_1.BadRequestException('No file uploaded');
                    }
                    csvContent = file.buffer.toString('utf-8');
                    return [2 /*return*/, this.votersService.importFromCsv(csvContent, importDto.skipDuplicates !== false, importDto.autoGeocode === true)];
                });
            });
        };
        VotersController_1.prototype.exportCsv = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var csv;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.votersService.exportToCsv(query)];
                        case 1:
                            csv = _a.sent();
                            return [2 /*return*/, new common_1.StreamableFile(Buffer.from(csv, 'utf-8'))];
                    }
                });
            });
        };
        // ==================== REFERRAL SYSTEM ====================
        VotersController_1.prototype.getReferrals = function (id, query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.votersService.getReferrals(id, query.page, query.perPage, query.supportLevel)];
                });
            });
        };
        VotersController_1.prototype.getReferralStats = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.votersService.getReferralStats(id)];
                });
            });
        };
        VotersController_1.prototype.generateReferralCode = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var code, baseUrl, referralUrl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.votersService.generateReferralCode(id)];
                        case 1:
                            code = _a.sent();
                            baseUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
                            referralUrl = "".concat(baseUrl, "/cadastro?ref=").concat(code);
                            return [2 /*return*/, {
                                    referralCode: code,
                                    referralUrl: referralUrl,
                                }];
                    }
                });
            });
        };
        VotersController_1.prototype.registerReferral = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var referralCode, voterData;
                return __generator(this, function (_a) {
                    referralCode = dto.referralCode, voterData = __rest(dto, ["referralCode"]);
                    return [2 /*return*/, this.votersService.registerReferral(referralCode, voterData)];
                });
            });
        };
        return VotersController_1;
    }());
    __setFunctionName(_classThis, "VotersController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA), (0, swagger_1.ApiOperation)({ summary: 'Create a new voter' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Voter created successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation failed' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' })];
        _findAll_decorators = [(0, common_1.Get)(), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA, roles_decorator_1.UserRole.ESCRITORIO), (0, swagger_1.ApiOperation)({ summary: 'Get all voters with pagination and filtering' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns paginated list of voters' })];
        _getStatistics_decorators = [(0, common_1.Get)('statistics'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA), (0, swagger_1.ApiOperation)({ summary: 'Get voter statistics and analytics' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns voter statistics' })];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA, roles_decorator_1.UserRole.ESCRITORIO), (0, swagger_1.ApiOperation)({ summary: 'Get a voter by ID' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Voter UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the voter' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Voter not found' })];
        _update_decorators = [(0, common_1.Patch)(':id'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA), (0, swagger_1.ApiOperation)({ summary: 'Update a voter' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Voter UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Voter updated successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Voter not found' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation failed' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' })];
        _remove_decorators = [(0, common_1.Delete)(':id'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA), (0, swagger_1.ApiOperation)({ summary: 'Delete a voter (soft delete)' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Voter UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Voter deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Voter not found' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' })];
        _bulkDelete_decorators = [(0, common_1.Post)('bulk/delete'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA), (0, swagger_1.ApiOperation)({ summary: 'Bulk delete voters (soft delete)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns bulk delete results' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' })];
        _bulkUpdate_decorators = [(0, common_1.Patch)('bulk/update'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA), (0, swagger_1.ApiOperation)({ summary: 'Bulk update voters' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns bulk update results' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' })];
        _geocode_decorators = [(0, common_1.Post)(':id/geocode'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA), (0, swagger_1.ApiOperation)({ summary: 'Geocode voter address and update coordinates' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Voter UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Voter geocoded successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Voter not found' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' })];
        _findNearby_decorators = [(0, common_1.Get)('location/nearby'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA, roles_decorator_1.UserRole.ESCRITORIO), (0, swagger_1.ApiOperation)({ summary: 'Find voters near a location' }), (0, swagger_1.ApiQuery)({ name: 'lat', description: 'Latitude', example: -23.5505 }), (0, swagger_1.ApiQuery)({ name: 'lng', description: 'Longitude', example: -46.6333 }), (0, swagger_1.ApiQuery)({ name: 'radius', description: 'Radius in kilometers', example: 5 }), (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Max results', example: 50, required: false }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns voters near location' })];
        _findInGeofence_decorators = [(0, common_1.Post)('location/geofence'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA), (0, swagger_1.ApiOperation)({ summary: 'Find voters within a geofence' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns voters in geofence' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' })];
        _groupByProximity_decorators = [(0, common_1.Post)('location/group-by-proximity'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA), (0, swagger_1.ApiOperation)({ summary: 'Group voters by proximity to multiple locations' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns voters grouped by location' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' })];
        _batchGeocode_decorators = [(0, common_1.Post)('location/batch-geocode'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA), (0, swagger_1.ApiOperation)({ summary: 'Batch geocode voters missing coordinates' }), (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Max voters to geocode', example: 10, required: false }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns geocoding results' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' })];
        _importCsv_decorators = [(0, common_1.Post)('import/csv'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')), (0, swagger_1.ApiOperation)({ summary: 'Import voters from CSV file' }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
                description: 'CSV file upload',
                schema: {
                    type: 'object',
                    properties: {
                        file: {
                            type: 'string',
                            format: 'binary',
                        },
                        skipDuplicates: {
                            type: 'boolean',
                            default: true,
                        },
                        autoGeocode: {
                            type: 'boolean',
                            default: false,
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Returns import results' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - invalid CSV format' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' })];
        _exportCsv_decorators = [(0, common_1.Get)('export/csv'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA, roles_decorator_1.UserRole.ESCRITORIO), (0, swagger_1.ApiOperation)({ summary: 'Export voters to CSV file' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns CSV file' }), (0, common_1.Header)('Content-Type', 'text/csv'), (0, common_1.Header)('Content-Disposition', 'attachment; filename="voters.csv"')];
        _getReferrals_decorators = [(0, common_1.Get)(':id/referrals'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA, roles_decorator_1.UserRole.ESCRITORIO), (0, swagger_1.ApiOperation)({ summary: 'Get list of voters referred by this voter' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Voter UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of referred voters with pagination' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Voter not found' })];
        _getReferralStats_decorators = [(0, common_1.Get)(':id/referral-stats'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA, roles_decorator_1.UserRole.ESCRITORIO), (0, swagger_1.ApiOperation)({ summary: 'Get referral statistics for a voter' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Voter UUID' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Returns referral statistics',
                type: referral_dto_1.ReferralStatsDto,
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Voter not found' })];
        _generateReferralCode_decorators = [(0, common_1.Post)(':id/referral-code'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA), (0, swagger_1.ApiOperation)({ summary: 'Generate or retrieve referral code for a voter' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Voter UUID' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Returns referral code and URL',
                type: referral_dto_1.ReferralCodeDto,
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Voter not found' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' })];
        _registerReferral_decorators = [(0, common_1.Post)('register-referral'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({
                summary: 'Register new voter via referral code (public endpoint)',
                description: 'Used when someone clicks on a referral link and signs up',
            }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Voter created via referral successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Invalid referral code' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation failed' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStatistics_decorators, { kind: "method", name: "getStatistics", static: false, private: false, access: { has: function (obj) { return "getStatistics" in obj; }, get: function (obj) { return obj.getStatistics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _bulkDelete_decorators, { kind: "method", name: "bulkDelete", static: false, private: false, access: { has: function (obj) { return "bulkDelete" in obj; }, get: function (obj) { return obj.bulkDelete; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _bulkUpdate_decorators, { kind: "method", name: "bulkUpdate", static: false, private: false, access: { has: function (obj) { return "bulkUpdate" in obj; }, get: function (obj) { return obj.bulkUpdate; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _geocode_decorators, { kind: "method", name: "geocode", static: false, private: false, access: { has: function (obj) { return "geocode" in obj; }, get: function (obj) { return obj.geocode; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findNearby_decorators, { kind: "method", name: "findNearby", static: false, private: false, access: { has: function (obj) { return "findNearby" in obj; }, get: function (obj) { return obj.findNearby; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findInGeofence_decorators, { kind: "method", name: "findInGeofence", static: false, private: false, access: { has: function (obj) { return "findInGeofence" in obj; }, get: function (obj) { return obj.findInGeofence; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _groupByProximity_decorators, { kind: "method", name: "groupByProximity", static: false, private: false, access: { has: function (obj) { return "groupByProximity" in obj; }, get: function (obj) { return obj.groupByProximity; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _batchGeocode_decorators, { kind: "method", name: "batchGeocode", static: false, private: false, access: { has: function (obj) { return "batchGeocode" in obj; }, get: function (obj) { return obj.batchGeocode; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _importCsv_decorators, { kind: "method", name: "importCsv", static: false, private: false, access: { has: function (obj) { return "importCsv" in obj; }, get: function (obj) { return obj.importCsv; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _exportCsv_decorators, { kind: "method", name: "exportCsv", static: false, private: false, access: { has: function (obj) { return "exportCsv" in obj; }, get: function (obj) { return obj.exportCsv; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getReferrals_decorators, { kind: "method", name: "getReferrals", static: false, private: false, access: { has: function (obj) { return "getReferrals" in obj; }, get: function (obj) { return obj.getReferrals; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getReferralStats_decorators, { kind: "method", name: "getReferralStats", static: false, private: false, access: { has: function (obj) { return "getReferralStats" in obj; }, get: function (obj) { return obj.getReferralStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateReferralCode_decorators, { kind: "method", name: "generateReferralCode", static: false, private: false, access: { has: function (obj) { return "generateReferralCode" in obj; }, get: function (obj) { return obj.generateReferralCode; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _registerReferral_decorators, { kind: "method", name: "registerReferral", static: false, private: false, access: { has: function (obj) { return "registerReferral" in obj; }, get: function (obj) { return obj.registerReferral; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VotersController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VotersController = _classThis;
}();
exports.VotersController = VotersController;
