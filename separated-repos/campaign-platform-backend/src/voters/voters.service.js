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
exports.VotersService = void 0;
var common_1 = require("@nestjs/common");
var drizzle_orm_1 = require("drizzle-orm");
var schemas_1 = require("../database/schemas");
var Papa = require("papaparse");
var VotersService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var VotersService = _classThis = /** @class */ (function () {
        function VotersService_1(databaseService, mapsService, viaCepService) {
            this.databaseService = databaseService;
            this.mapsService = mapsService;
            this.viaCepService = viaCepService;
        }
        VotersService_1.prototype.create = function (createVoterDto) {
            return __awaiter(this, void 0, void 0, function () {
                var db, values, voter;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            if (!(createVoterDto.zipCode &&
                                createVoterDto.addressNumber &&
                                !createVoterDto.latitude &&
                                !createVoterDto.longitude)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.autoGeocodeFromCep(createVoterDto)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            values = this.prepareVoterForSave(createVoterDto);
                            return [4 /*yield*/, db
                                    .insert(schemas_1.voters)
                                    .values(values)
                                    .returning()];
                        case 3:
                            voter = (_a.sent())[0];
                            return [2 /*return*/, this.formatVoter(voter)];
                    }
                });
            });
        };
        VotersService_1.prototype.findAll = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var db, _a, page, _b, limit, offset, conditions, searchCondition, sortBy, sortOrder, sortColumn, _c, countResult, results, count;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            _a = query.page, page = _a === void 0 ? 1 : _a, _b = query.limit, limit = _b === void 0 ? 10 : _b;
                            offset = (page - 1) * limit;
                            conditions = [(0, drizzle_orm_1.isNull)(schemas_1.voters.deletedAt)];
                            // Search by name or CPF
                            if (query.search) {
                                searchCondition = (0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schemas_1.voters.name, "%".concat(query.search, "%")), (0, drizzle_orm_1.ilike)(schemas_1.voters.cpf, "%".concat(query.search, "%")));
                                if (searchCondition) {
                                    conditions.push(searchCondition);
                                }
                            }
                            // Location filters
                            if (query.city) {
                                conditions.push((0, drizzle_orm_1.eq)(schemas_1.voters.city, query.city));
                            }
                            if (query.state) {
                                conditions.push((0, drizzle_orm_1.eq)(schemas_1.voters.state, query.state));
                            }
                            if (query.neighborhood) {
                                conditions.push((0, drizzle_orm_1.eq)(schemas_1.voters.neighborhood, query.neighborhood));
                            }
                            // Electoral filters
                            if (query.electoralZone) {
                                conditions.push((0, drizzle_orm_1.eq)(schemas_1.voters.electoralZone, query.electoralZone));
                            }
                            if (query.electoralSection) {
                                conditions.push((0, drizzle_orm_1.eq)(schemas_1.voters.electoralSection, query.electoralSection));
                            }
                            // Demographic filters
                            if (query.gender) {
                                conditions.push((0, drizzle_orm_1.eq)(schemas_1.voters.gender, query.gender));
                            }
                            if (query.educationLevel) {
                                conditions.push((0, drizzle_orm_1.eq)(schemas_1.voters.educationLevel, query.educationLevel));
                            }
                            if (query.incomeLevel) {
                                conditions.push((0, drizzle_orm_1.eq)(schemas_1.voters.incomeLevel, query.incomeLevel));
                            }
                            if (query.maritalStatus) {
                                conditions.push((0, drizzle_orm_1.eq)(schemas_1.voters.maritalStatus, query.maritalStatus));
                            }
                            // Political filters
                            if (query.supportLevel) {
                                conditions.push((0, drizzle_orm_1.eq)(schemas_1.voters.supportLevel, query.supportLevel));
                            }
                            if (query.occupation) {
                                conditions.push((0, drizzle_orm_1.ilike)(schemas_1.voters.occupation, "%".concat(query.occupation, "%")));
                            }
                            if (query.religion) {
                                conditions.push((0, drizzle_orm_1.ilike)(schemas_1.voters.religion, "%".concat(query.religion, "%")));
                            }
                            // Contact filters
                            if (query.hasWhatsapp) {
                                conditions.push((0, drizzle_orm_1.eq)(schemas_1.voters.hasWhatsapp, query.hasWhatsapp));
                            }
                            sortBy = query.sortBy || 'createdAt';
                            sortOrder = query.sortOrder || 'desc';
                            sortColumn = {
                                name: schemas_1.voters.name,
                                email: schemas_1.voters.email,
                                city: schemas_1.voters.city,
                                state: schemas_1.voters.state,
                                supportLevel: schemas_1.voters.supportLevel,
                                createdAt: schemas_1.voters.createdAt,
                                updatedAt: schemas_1.voters.updatedAt,
                            }[sortBy] || schemas_1.voters.createdAt;
                            return [4 /*yield*/, Promise.all([
                                    db
                                        .select({ count: (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["count(*)::int"], ["count(*)::int"]))) })
                                        .from(schemas_1.voters)
                                        .where(drizzle_orm_1.and.apply(void 0, conditions)),
                                    db
                                        .select()
                                        .from(schemas_1.voters)
                                        .where(drizzle_orm_1.and.apply(void 0, conditions))
                                        .limit(limit)
                                        .offset(offset)
                                        .orderBy(sortOrder === 'asc' ? (0, drizzle_orm_1.asc)(sortColumn) : (0, drizzle_orm_1.desc)(sortColumn)),
                                ])];
                        case 1:
                            _c = _d.sent(), countResult = _c[0], results = _c[1];
                            count = countResult[0].count;
                            return [2 /*return*/, {
                                    data: results.map(this.formatVoter),
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
        VotersService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var db, voter;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, db
                                    .select()
                                    .from(schemas_1.voters)
                                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.voters.id, id), (0, drizzle_orm_1.isNull)(schemas_1.voters.deletedAt)))];
                        case 1:
                            voter = (_a.sent())[0];
                            if (!voter) {
                                throw new common_1.NotFoundException("Voter with ID ".concat(id, " not found"));
                            }
                            return [2 /*return*/, this.formatVoter(voter)];
                    }
                });
            });
        };
        VotersService_1.prototype.update = function (id, updateVoterDto) {
            return __awaiter(this, void 0, void 0, function () {
                var db, values, voter;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            // Check if voter exists
                            return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            // Check if voter exists
                            _a.sent();
                            if (!(updateVoterDto.zipCode &&
                                updateVoterDto.addressNumber &&
                                !updateVoterDto.latitude &&
                                !updateVoterDto.longitude)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.autoGeocodeFromCep(updateVoterDto)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            values = __assign(__assign({}, this.prepareVoterForSave(updateVoterDto)), { updatedAt: new Date() });
                            return [4 /*yield*/, db
                                    .update(schemas_1.voters)
                                    .set(values)
                                    .where((0, drizzle_orm_1.eq)(schemas_1.voters.id, id))
                                    .returning()];
                        case 4:
                            voter = (_a.sent())[0];
                            return [2 /*return*/, this.formatVoter(voter)];
                    }
                });
            });
        };
        VotersService_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var db;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            // Check if voter exists
                            return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            // Check if voter exists
                            _a.sent();
                            // Soft delete
                            return [4 /*yield*/, db
                                    .update(schemas_1.voters)
                                    .set({
                                    deletedAt: new Date(),
                                })
                                    .where((0, drizzle_orm_1.eq)(schemas_1.voters.id, id))];
                        case 2:
                            // Soft delete
                            _a.sent();
                            return [2 /*return*/, { message: 'Voter deleted successfully' }];
                    }
                });
            });
        };
        /**
         * Geocode voter address and update coordinates
         */
        VotersService_1.prototype.geocodeVoter = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var voter, addressParts, fullAddress, geocodingResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            voter = _a.sent();
                            addressParts = [
                                voter.address,
                                voter.addressNumber,
                                voter.neighborhood,
                                voter.city,
                                voter.state,
                                voter.zipCode,
                            ].filter(Boolean);
                            if (addressParts.length === 0) {
                                throw new common_1.BadRequestException('Voter has no address to geocode');
                            }
                            fullAddress = addressParts.join(', ');
                            return [4 /*yield*/, this.mapsService.geocodeAddress(fullAddress)];
                        case 2:
                            geocodingResult = _a.sent();
                            if (!geocodingResult) {
                                throw new common_1.BadRequestException('Could not geocode address');
                            }
                            // Update voter with coordinates
                            return [2 /*return*/, this.update(id, {
                                    latitude: geocodingResult.latitude,
                                    longitude: geocodingResult.longitude,
                                })];
                    }
                });
            });
        };
        /**
         * Find voters near a location (within radius)
         */
        VotersService_1.prototype.findNearLocation = function (latitude_1, longitude_1, radiusKm_1) {
            return __awaiter(this, arguments, void 0, function (latitude, longitude, radiusKm, limit) {
                var db, allVoters, votersWithDistance;
                var _this = this;
                if (limit === void 0) { limit = 50; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, db
                                    .select()
                                    .from(schemas_1.voters)
                                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.isNull)(schemas_1.voters.deletedAt), (0, drizzle_orm_1.isNotNull)(schemas_1.voters.latitude), (0, drizzle_orm_1.isNotNull)(schemas_1.voters.longitude)))];
                        case 1:
                            allVoters = _a.sent();
                            votersWithDistance = allVoters
                                .map(function (voter) {
                                var voterLat = parseFloat(voter.latitude);
                                var voterLng = parseFloat(voter.longitude);
                                var distance = _this.mapsService.calculateDistance(latitude, longitude, voterLat, voterLng);
                                return __assign(__assign({}, _this.formatVoter(voter)), { distance: distance });
                            })
                                .filter(function (voter) { return voter.distance <= radiusKm; })
                                .sort(function (a, b) { return a.distance - b.distance; })
                                .slice(0, limit);
                            return [2 /*return*/, {
                                    centerPoint: { latitude: latitude, longitude: longitude },
                                    radiusKm: radiusKm,
                                    total: votersWithDistance.length,
                                    voters: votersWithDistance,
                                }];
                    }
                });
            });
        };
        /**
         * Find voters within a geofence
         */
        VotersService_1.prototype.findInGeofence = function (geofenceType, geofenceData) {
            return __awaiter(this, void 0, void 0, function () {
                var db, allVoters, votersInGeofence;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, db
                                    .select()
                                    .from(schemas_1.voters)
                                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.isNull)(schemas_1.voters.deletedAt), (0, drizzle_orm_1.isNotNull)(schemas_1.voters.latitude), (0, drizzle_orm_1.isNotNull)(schemas_1.voters.longitude)))];
                        case 1:
                            allVoters = _a.sent();
                            votersInGeofence = allVoters.filter(function (voter) {
                                var voterLat = parseFloat(voter.latitude);
                                var voterLng = parseFloat(voter.longitude);
                                if (geofenceType === 'CIRCLE') {
                                    var circleData = geofenceData;
                                    return _this.mapsService.isPointInCircle(voterLat, voterLng, circleData.centerLat, circleData.centerLng, circleData.radiusKm);
                                }
                                else if (geofenceType === 'POLYGON') {
                                    var polygonData = geofenceData;
                                    return _this.mapsService.isPointInPolygon(voterLat, voterLng, polygonData.polygon);
                                }
                                return false;
                            });
                            return [2 /*return*/, {
                                    geofenceType: geofenceType,
                                    total: votersInGeofence.length,
                                    voters: votersInGeofence.map(this.formatVoter),
                                }];
                    }
                });
            });
        };
        /**
         * Get voters grouped by proximity to multiple locations
         */
        VotersService_1.prototype.groupByProximity = function (locations_1) {
            return __awaiter(this, arguments, void 0, function (locations, maxDistanceKm) {
                var db, allVoters, groupedVoters;
                var _this = this;
                if (maxDistanceKm === void 0) { maxDistanceKm = 5; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, db
                                    .select()
                                    .from(schemas_1.voters)
                                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.isNull)(schemas_1.voters.deletedAt), (0, drizzle_orm_1.isNotNull)(schemas_1.voters.latitude), (0, drizzle_orm_1.isNotNull)(schemas_1.voters.longitude)))];
                        case 1:
                            allVoters = _a.sent();
                            groupedVoters = locations.map(function (location) {
                                var nearby = allVoters
                                    .map(function (voter) {
                                    var voterLat = parseFloat(voter.latitude);
                                    var voterLng = parseFloat(voter.longitude);
                                    var distance = _this.mapsService.calculateDistance(location.lat, location.lng, voterLat, voterLng);
                                    return { voter: _this.formatVoter(voter), distance: distance };
                                })
                                    .filter(function (item) { return item.distance <= maxDistanceKm; })
                                    .sort(function (a, b) { return a.distance - b.distance; });
                                return {
                                    location: location.name,
                                    coordinates: { lat: location.lat, lng: location.lng },
                                    count: nearby.length,
                                    voters: nearby,
                                };
                            });
                            return [2 /*return*/, groupedVoters];
                    }
                });
            });
        };
        /**
         * Batch geocode all voters missing coordinates
         */
        VotersService_1.prototype.batchGeocodeVoters = function () {
            return __awaiter(this, arguments, void 0, function (limit) {
                var db, votersToGeocode, results, _i, votersToGeocode_1, voter, error_1;
                if (limit === void 0) { limit = 10; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, db
                                    .select()
                                    .from(schemas_1.voters)
                                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.isNull)(schemas_1.voters.deletedAt), (0, drizzle_orm_1.isNull)(schemas_1.voters.latitude), (0, drizzle_orm_1.isNotNull)(schemas_1.voters.address)))
                                    .limit(limit)];
                        case 1:
                            votersToGeocode = _a.sent();
                            results = {
                                total: votersToGeocode.length,
                                success: 0,
                                failed: 0,
                                details: [],
                            };
                            _i = 0, votersToGeocode_1 = votersToGeocode;
                            _a.label = 2;
                        case 2:
                            if (!(_i < votersToGeocode_1.length)) return [3 /*break*/, 7];
                            voter = votersToGeocode_1[_i];
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.geocodeVoter(voter.id)];
                        case 4:
                            _a.sent();
                            results.success++;
                            results.details.push({ id: voter.id, status: 'success' });
                            return [3 /*break*/, 6];
                        case 5:
                            error_1 = _a.sent();
                            results.failed++;
                            results.details.push({
                                id: voter.id,
                                status: 'failed',
                                error: error_1.message,
                            });
                            return [3 /*break*/, 6];
                        case 6:
                            _i++;
                            return [3 /*break*/, 2];
                        case 7: return [2 /*return*/, results];
                    }
                });
            });
        };
        /**
         * Get voter statistics and analytics
         */
        VotersService_1.prototype.getStatistics = function () {
            return __awaiter(this, void 0, void 0, function () {
                var db, allVoters, stats;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, db.select().from(schemas_1.voters).where((0, drizzle_orm_1.isNull)(schemas_1.voters.deletedAt))];
                        case 1:
                            allVoters = _a.sent();
                            stats = {
                                total: allVoters.length,
                                byGender: this.groupBy(allVoters, 'gender'),
                                byEducationLevel: this.groupBy(allVoters, 'educationLevel'),
                                byIncomeLevel: this.groupBy(allVoters, 'incomeLevel'),
                                byMaritalStatus: this.groupBy(allVoters, 'maritalStatus'),
                                bySupportLevel: this.groupBy(allVoters, 'supportLevel'),
                                byCity: this.groupBy(allVoters, 'city'),
                                byNeighborhood: this.groupBy(allVoters, 'neighborhood'),
                                byElectoralZone: this.groupBy(allVoters, 'electoralZone'),
                                contact: {
                                    withEmail: allVoters.filter(function (v) { return v.email; }).length,
                                    withPhone: allVoters.filter(function (v) { return v.phone; }).length,
                                    withWhatsapp: allVoters.filter(function (v) { return v.hasWhatsapp === 'SIM'; }).length,
                                },
                                location: {
                                    withCoordinates: allVoters.filter(function (v) { return v.latitude && v.longitude; }).length,
                                    withoutCoordinates: allVoters.filter(function (v) { return !v.latitude || !v.longitude; }).length,
                                },
                                age: this.calculateAgeStats(allVoters),
                                recentlyAdded: {
                                    last7Days: allVoters.filter(function (v) {
                                        var daysDiff = (Date.now() - new Date(v.createdAt).getTime()) / (1000 * 60 * 60 * 24);
                                        return daysDiff <= 7;
                                    }).length,
                                    last30Days: allVoters.filter(function (v) {
                                        var daysDiff = (Date.now() - new Date(v.createdAt).getTime()) / (1000 * 60 * 60 * 24);
                                        return daysDiff <= 30;
                                    }).length,
                                },
                            };
                            return [2 /*return*/, stats];
                    }
                });
            });
        };
        /**
         * Helper: Group voters by a field
         */
        VotersService_1.prototype.groupBy = function (voters, field) {
            return voters.reduce(function (acc, voter) {
                var value = voter[field] || 'NOT_SPECIFIED';
                acc[value] = (acc[value] || 0) + 1;
                return acc;
            }, {});
        };
        /**
         * Helper: Calculate age statistics
         */
        VotersService_1.prototype.calculateAgeStats = function (voters) {
            var votersWithAge = voters.filter(function (v) { return v.dateOfBirth; });
            if (votersWithAge.length === 0) {
                return {
                    averageAge: null,
                    ageRanges: {},
                };
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
            var ageRanges = {
                '16-24': ages.filter(function (age) { return age >= 16 && age <= 24; }).length,
                '25-34': ages.filter(function (age) { return age >= 25 && age <= 34; }).length,
                '35-44': ages.filter(function (age) { return age >= 35 && age <= 44; }).length,
                '45-59': ages.filter(function (age) { return age >= 45 && age <= 59; }).length,
                '60+': ages.filter(function (age) { return age >= 60; }).length,
            };
            return {
                averageAge: averageAge,
                ageRanges: ageRanges,
                withAgeData: votersWithAge.length,
            };
        };
        /**
         * Bulk delete voters (soft delete)
         */
        VotersService_1.prototype.bulkDelete = function (ids) {
            return __awaiter(this, void 0, void 0, function () {
                var db, result, _i, ids_1, id, voter, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            result = {
                                requested: ids.length,
                                deleted: 0,
                                notFound: [],
                            };
                            _i = 0, ids_1 = ids;
                            _a.label = 1;
                        case 1:
                            if (!(_i < ids_1.length)) return [3 /*break*/, 7];
                            id = ids_1[_i];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 5, , 6]);
                            return [4 /*yield*/, db
                                    .select()
                                    .from(schemas_1.voters)
                                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.voters.id, id), (0, drizzle_orm_1.isNull)(schemas_1.voters.deletedAt)))];
                        case 3:
                            voter = (_a.sent())[0];
                            if (!voter) {
                                result.notFound.push(id);
                                return [3 /*break*/, 6];
                            }
                            return [4 /*yield*/, db.update(schemas_1.voters).set({ deletedAt: new Date() }).where((0, drizzle_orm_1.eq)(schemas_1.voters.id, id))];
                        case 4:
                            _a.sent();
                            result.deleted++;
                            return [3 /*break*/, 6];
                        case 5:
                            error_2 = _a.sent();
                            result.notFound.push(id);
                            return [3 /*break*/, 6];
                        case 6:
                            _i++;
                            return [3 /*break*/, 1];
                        case 7: return [2 /*return*/, result];
                    }
                });
            });
        };
        /**
         * Bulk update voters
         */
        VotersService_1.prototype.bulkUpdate = function (updates) {
            return __awaiter(this, void 0, void 0, function () {
                var db, result, _i, updates_1, update, voter, values, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            result = {
                                requested: updates.length,
                                updated: 0,
                                failed: [],
                            };
                            _i = 0, updates_1 = updates;
                            _a.label = 1;
                        case 1:
                            if (!(_i < updates_1.length)) return [3 /*break*/, 7];
                            update = updates_1[_i];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 5, , 6]);
                            return [4 /*yield*/, db
                                    .select()
                                    .from(schemas_1.voters)
                                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.voters.id, update.id), (0, drizzle_orm_1.isNull)(schemas_1.voters.deletedAt)))];
                        case 3:
                            voter = (_a.sent())[0];
                            if (!voter) {
                                result.failed.push({ id: update.id, error: 'Voter not found' });
                                return [3 /*break*/, 6];
                            }
                            values = __assign(__assign({}, this.prepareVoterForSave(update.data)), { updatedAt: new Date() });
                            return [4 /*yield*/, db
                                    .update(schemas_1.voters)
                                    .set(values)
                                    .where((0, drizzle_orm_1.eq)(schemas_1.voters.id, update.id))];
                        case 4:
                            _a.sent();
                            result.updated++;
                            return [3 /*break*/, 6];
                        case 5:
                            error_3 = _a.sent();
                            result.failed.push({
                                id: update.id,
                                error: error_3.message || 'Unknown error',
                            });
                            return [3 /*break*/, 6];
                        case 6:
                            _i++;
                            return [3 /*break*/, 1];
                        case 7: return [2 /*return*/, result];
                    }
                });
            });
        };
        /**
         * Import voters from CSV file
         */
        VotersService_1.prototype.importFromCsv = function (csvContent_1) {
            return __awaiter(this, arguments, void 0, function (csvContent, skipDuplicates, autoGeocode) {
                var db, result, parsed, i, row, existing, voterDto, error_4;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
                if (skipDuplicates === void 0) { skipDuplicates = true; }
                if (autoGeocode === void 0) { autoGeocode = false; }
                return __generator(this, function (_4) {
                    switch (_4.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            result = {
                                total: 0,
                                imported: 0,
                                skipped: 0,
                                failed: 0,
                                errors: [],
                            };
                            parsed = Papa.parse(csvContent, {
                                header: true,
                                skipEmptyLines: true,
                                transformHeader: function (header) {
                                    // Normalize header names
                                    var headerMap = {
                                        nome: 'name',
                                        'nome completo': 'name',
                                        cpf: 'cpf',
                                        'data de nascimento': 'dateOfBirth',
                                        data_nascimento: 'dateOfBirth',
                                        sexo: 'gender',
                                        genero: 'gender',
                                        telefone: 'phone',
                                        celular: 'phone',
                                        whatsapp: 'whatsapp',
                                        email: 'email',
                                        'e-mail': 'email',
                                        endereco: 'address',
                                        endereço: 'address',
                                        numero: 'addressNumber',
                                        número: 'addressNumber',
                                        complemento: 'addressComplement',
                                        bairro: 'neighborhood',
                                        cidade: 'city',
                                        estado: 'state',
                                        uf: 'state',
                                        cep: 'zipCode',
                                        latitude: 'latitude',
                                        longitude: 'longitude',
                                        'titulo eleitoral': 'electoralTitle',
                                        titulo: 'electoralTitle',
                                        zona: 'electoralZone',
                                        'zona eleitoral': 'electoralZone',
                                        secao: 'electoralSection',
                                        seção: 'electoralSection',
                                        'local de votacao': 'votingLocation',
                                        'local de votação': 'votingLocation',
                                        escolaridade: 'educationLevel',
                                        profissao: 'occupation',
                                        profissão: 'occupation',
                                        ocupacao: 'occupation',
                                        ocupação: 'occupation',
                                        renda: 'incomeLevel',
                                        'estado civil': 'maritalStatus',
                                        religiao: 'religion',
                                        religião: 'religion',
                                        etnia: 'ethnicity',
                                        facebook: 'facebook',
                                        instagram: 'instagram',
                                        twitter: 'twitter',
                                        'nivel de apoio': 'supportLevel',
                                        'nível de apoio': 'supportLevel',
                                        apoio: 'supportLevel',
                                        partido: 'politicalParty',
                                        'partido politico': 'politicalParty',
                                        'histórico de votação': 'votingHistory',
                                        historico: 'votingHistory',
                                        'membros familia': 'familyMembers',
                                        'membros da família': 'familyMembers',
                                        'tem whatsapp': 'hasWhatsapp',
                                        'contato preferido': 'preferredContact',
                                        notas: 'notes',
                                        observacoes: 'notes',
                                        observações: 'notes',
                                        tags: 'tags',
                                    };
                                    var normalized = header.toLowerCase().trim();
                                    return headerMap[normalized] || header;
                                },
                            });
                            if (parsed.errors.length > 0) {
                                throw new common_1.BadRequestException("CSV parsing failed: ".concat(parsed.errors[0].message));
                            }
                            result.total = parsed.data.length;
                            i = 0;
                            _4.label = 1;
                        case 1:
                            if (!(i < parsed.data.length)) return [3 /*break*/, 8];
                            row = parsed.data[i];
                            _4.label = 2;
                        case 2:
                            _4.trys.push([2, 6, , 7]);
                            // Skip if name is missing
                            if (!row.name || row.name.trim() === '') {
                                result.skipped++;
                                result.errors.push({
                                    row: i + 1,
                                    data: row,
                                    error: 'Name is required',
                                });
                                return [3 /*break*/, 7];
                            }
                            if (!(skipDuplicates && row.cpf)) return [3 /*break*/, 4];
                            return [4 /*yield*/, db
                                    .select()
                                    .from(schemas_1.voters)
                                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.voters.cpf, row.cpf), (0, drizzle_orm_1.isNull)(schemas_1.voters.deletedAt)))
                                    .limit(1)];
                        case 3:
                            existing = (_4.sent())[0];
                            if (existing) {
                                result.skipped++;
                                result.errors.push({
                                    row: i + 1,
                                    data: row,
                                    error: "Duplicate CPF: ".concat(row.cpf),
                                });
                                return [3 /*break*/, 7];
                            }
                            _4.label = 4;
                        case 4:
                            voterDto = {
                                name: (_a = row.name) === null || _a === void 0 ? void 0 : _a.trim(),
                                cpf: ((_b = row.cpf) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                                dateOfBirth: row.dateOfBirth || undefined,
                                gender: this.mapGender(row.gender),
                                phone: ((_c = row.phone) === null || _c === void 0 ? void 0 : _c.trim()) || undefined,
                                whatsapp: ((_d = row.whatsapp) === null || _d === void 0 ? void 0 : _d.trim()) || undefined,
                                email: ((_e = row.email) === null || _e === void 0 ? void 0 : _e.trim()) || undefined,
                                address: ((_f = row.address) === null || _f === void 0 ? void 0 : _f.trim()) || undefined,
                                addressNumber: ((_g = row.addressNumber) === null || _g === void 0 ? void 0 : _g.trim()) || undefined,
                                addressComplement: ((_h = row.addressComplement) === null || _h === void 0 ? void 0 : _h.trim()) || undefined,
                                neighborhood: ((_j = row.neighborhood) === null || _j === void 0 ? void 0 : _j.trim()) || undefined,
                                city: ((_k = row.city) === null || _k === void 0 ? void 0 : _k.trim()) || undefined,
                                state: ((_l = row.state) === null || _l === void 0 ? void 0 : _l.trim().toUpperCase()) || undefined,
                                zipCode: ((_m = row.zipCode) === null || _m === void 0 ? void 0 : _m.trim()) || undefined,
                                latitude: row.latitude ? parseFloat(row.latitude) : undefined,
                                longitude: row.longitude ? parseFloat(row.longitude) : undefined,
                                electoralTitle: ((_o = row.electoralTitle) === null || _o === void 0 ? void 0 : _o.trim()) || undefined,
                                electoralZone: ((_p = row.electoralZone) === null || _p === void 0 ? void 0 : _p.trim()) || undefined,
                                electoralSection: ((_q = row.electoralSection) === null || _q === void 0 ? void 0 : _q.trim()) || undefined,
                                votingLocation: ((_r = row.votingLocation) === null || _r === void 0 ? void 0 : _r.trim()) || undefined,
                                educationLevel: this.mapEducationLevel(row.educationLevel),
                                occupation: ((_s = row.occupation) === null || _s === void 0 ? void 0 : _s.trim()) || undefined,
                                incomeLevel: this.mapIncomeLevel(row.incomeLevel),
                                maritalStatus: this.mapMaritalStatus(row.maritalStatus),
                                religion: ((_t = row.religion) === null || _t === void 0 ? void 0 : _t.trim()) || undefined,
                                ethnicity: ((_u = row.ethnicity) === null || _u === void 0 ? void 0 : _u.trim()) || undefined,
                                facebook: ((_v = row.facebook) === null || _v === void 0 ? void 0 : _v.trim()) || undefined,
                                instagram: ((_w = row.instagram) === null || _w === void 0 ? void 0 : _w.trim()) || undefined,
                                twitter: ((_x = row.twitter) === null || _x === void 0 ? void 0 : _x.trim()) || undefined,
                                supportLevel: this.mapSupportLevel(row.supportLevel),
                                politicalParty: ((_y = row.politicalParty) === null || _y === void 0 ? void 0 : _y.trim()) || undefined,
                                votingHistory: ((_z = row.votingHistory) === null || _z === void 0 ? void 0 : _z.trim()) || undefined,
                                familyMembers: row.familyMembers ? parseInt(row.familyMembers) : undefined,
                                hasWhatsapp: ((_0 = row.hasWhatsapp) === null || _0 === void 0 ? void 0 : _0.toUpperCase()) === 'SIM',
                                preferredContact: ((_1 = row.preferredContact) === null || _1 === void 0 ? void 0 : _1.toUpperCase()) || undefined,
                                notes: ((_2 = row.notes) === null || _2 === void 0 ? void 0 : _2.trim()) || undefined,
                                tags: ((_3 = row.tags) === null || _3 === void 0 ? void 0 : _3.trim()) || undefined,
                            };
                            // Create voter
                            return [4 /*yield*/, this.create(voterDto)];
                        case 5:
                            // Create voter
                            _4.sent();
                            result.imported++;
                            // Auto-geocode if requested and address is present
                            if (autoGeocode && voterDto.address) {
                                try {
                                    // This will be done asynchronously after import
                                    // For now, just log it
                                }
                                catch (geocodeError) {
                                    // Ignore geocoding errors during import
                                }
                            }
                            return [3 /*break*/, 7];
                        case 6:
                            error_4 = _4.sent();
                            result.failed++;
                            result.errors.push({
                                row: i + 1,
                                data: row,
                                error: error_4.message || 'Unknown error',
                            });
                            return [3 /*break*/, 7];
                        case 7:
                            i++;
                            return [3 /*break*/, 1];
                        case 8: return [2 /*return*/, result];
                    }
                });
            });
        };
        /**
         * Export voters to CSV format
         */
        VotersService_1.prototype.exportToCsv = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var data, csv;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findAll(__assign(__assign({}, query), { limit: 10000, page: 1 }))];
                        case 1:
                            data = (_a.sent()).data;
                            csv = Papa.unparse(data, {
                                header: true,
                                columns: [
                                    'id',
                                    'name',
                                    'cpf',
                                    'dateOfBirth',
                                    'gender',
                                    'phone',
                                    'whatsapp',
                                    'email',
                                    'address',
                                    'addressNumber',
                                    'addressComplement',
                                    'neighborhood',
                                    'city',
                                    'state',
                                    'zipCode',
                                    'latitude',
                                    'longitude',
                                    'electoralTitle',
                                    'electoralZone',
                                    'electoralSection',
                                    'votingLocation',
                                    'educationLevel',
                                    'occupation',
                                    'incomeLevel',
                                    'maritalStatus',
                                    'religion',
                                    'ethnicity',
                                    'supportLevel',
                                    'politicalParty',
                                    'hasWhatsapp',
                                    'preferredContact',
                                    'notes',
                                    'tags',
                                ],
                            });
                            return [2 /*return*/, csv];
                    }
                });
            });
        };
        // Helper methods for mapping CSV values to enum values
        VotersService_1.prototype.mapGender = function (value) {
            if (!value)
                return undefined;
            var normalized = value.toUpperCase().trim();
            var mapping = {
                M: 'MASCULINO',
                MASCULINO: 'MASCULINO',
                MALE: 'MASCULINO',
                F: 'FEMININO',
                FEMININO: 'FEMININO',
                FEMALE: 'FEMININO',
                OUTRO: 'OUTRO',
                OTHER: 'OUTRO',
            };
            return mapping[normalized] || 'NAO_INFORMADO';
        };
        VotersService_1.prototype.mapEducationLevel = function (value) {
            if (!value)
                return undefined;
            var normalized = value.toUpperCase().trim();
            var mapping = {
                'FUNDAMENTAL INCOMPLETO': 'FUNDAMENTAL_INCOMPLETO',
                'FUNDAMENTAL COMPLETO': 'FUNDAMENTAL_COMPLETO',
                'MEDIO INCOMPLETO': 'MEDIO_INCOMPLETO',
                'MEDIO COMPLETO': 'MEDIO_COMPLETO',
                'SUPERIOR INCOMPLETO': 'SUPERIOR_INCOMPLETO',
                'SUPERIOR COMPLETO': 'SUPERIOR_COMPLETO',
                'POS GRADUACAO': 'POS_GRADUACAO',
                'PÓS GRADUAÇÃO': 'POS_GRADUACAO',
            };
            return mapping[normalized] || 'NAO_INFORMADO';
        };
        VotersService_1.prototype.mapIncomeLevel = function (value) {
            if (!value)
                return undefined;
            var normalized = value.toUpperCase().trim();
            var mapping = {
                'ATE 1 SALARIO': 'ATE_1_SALARIO',
                'DE 1 A 2 SALARIOS': 'DE_1_A_2_SALARIOS',
                'DE 2 A 5 SALARIOS': 'DE_2_A_5_SALARIOS',
                'DE 5 A 10 SALARIOS': 'DE_5_A_10_SALARIOS',
                'ACIMA 10 SALARIOS': 'ACIMA_10_SALARIOS',
            };
            return mapping[normalized] || 'NAO_INFORMADO';
        };
        VotersService_1.prototype.mapMaritalStatus = function (value) {
            if (!value)
                return undefined;
            var normalized = value.toUpperCase().trim();
            var mapping = {
                SOLTEIRO: 'SOLTEIRO',
                CASADO: 'CASADO',
                DIVORCIADO: 'DIVORCIADO',
                VIUVO: 'VIUVO',
                VIÚVO: 'VIUVO',
                'UNIAO ESTAVEL': 'UNIAO_ESTAVEL',
                'UNIÃO ESTÁVEL': 'UNIAO_ESTAVEL',
            };
            return mapping[normalized] || 'NAO_INFORMADO';
        };
        VotersService_1.prototype.mapSupportLevel = function (value) {
            if (!value)
                return undefined;
            var normalized = value.toUpperCase().trim();
            var mapping = {
                'MUITO FAVORAVEL': 'MUITO_FAVORAVEL',
                'MUITO FAVORÁVEL': 'MUITO_FAVORAVEL',
                FAVORAVEL: 'FAVORAVEL',
                FAVORÁVEL: 'FAVORAVEL',
                NEUTRO: 'NEUTRO',
                DESFAVORAVEL: 'DESFAVORAVEL',
                DESFAVORÁVEL: 'DESFAVORAVEL',
                'MUITO DESFAVORAVEL': 'MUITO_DESFAVORAVEL',
                'MUITO DESFAVORÁVEL': 'MUITO_DESFAVORAVEL',
            };
            return mapping[normalized] || 'NAO_DEFINIDO';
        };
        /**
         * Format voter data - convert string coordinates back to numbers
         */
        VotersService_1.prototype.formatVoter = function (voter) {
            // Parse JSON fields
            var parseJsonField = function (field) {
                if (!field)
                    return null;
                if (typeof field === 'string') {
                    try {
                        return JSON.parse(field);
                    }
                    catch (_a) {
                        return field;
                    }
                }
                return field;
            };
            return __assign(__assign({}, voter), { 
                // Convert numeric coordinates to numbers
                latitude: voter.latitude ? parseFloat(voter.latitude) : null, longitude: voter.longitude ? parseFloat(voter.longitude) : null, 
                // Keep 'SIM'/'NAO' as strings - frontend will handle conversion if needed
                // Parse JSON text fields
                tags: parseJsonField(voter.tags), topIssues: parseJsonField(voter.topIssues), issuePositions: parseJsonField(voter.issuePositions), eventAttendance: parseJsonField(voter.eventAttendance), donationHistory: parseJsonField(voter.donationHistory), seasonalActivity: parseJsonField(voter.seasonalActivity), contentPreference: parseJsonField(voter.contentPreference), bestContactDay: parseJsonField(voter.bestContactDay) });
        };
        /**
         * Auto-geocode voter address using ViaCEP and Google Maps
         * Mutates the DTO to add address details and coordinates
         */
        VotersService_1.prototype.autoGeocodeFromCep = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var viaCepData, fullAddress, geocodeResult, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!dto.zipCode)
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, this.viaCepService.getAddressFromCep(dto.zipCode)];
                        case 2:
                            viaCepData = _a.sent();
                            if (!viaCepData) {
                                console.log("[AutoGeocode] ViaCEP data not found for CEP: ".concat(dto.zipCode));
                                return [2 /*return*/];
                            }
                            // Fill in address details from ViaCEP if not provided
                            if (!dto.address && viaCepData.logradouro) {
                                dto.address = viaCepData.logradouro;
                            }
                            if (!dto.neighborhood && viaCepData.bairro) {
                                dto.neighborhood = viaCepData.bairro;
                            }
                            if (!dto.city && viaCepData.localidade) {
                                dto.city = viaCepData.localidade;
                            }
                            if (!dto.state && viaCepData.uf) {
                                dto.state = viaCepData.uf;
                            }
                            fullAddress = this.viaCepService.buildFullAddress(viaCepData, dto.addressNumber);
                            console.log("[AutoGeocode] Geocoding address: ".concat(fullAddress));
                            return [4 /*yield*/, this.mapsService.geocodeAddress(fullAddress)];
                        case 3:
                            geocodeResult = _a.sent();
                            if (geocodeResult) {
                                dto.latitude = geocodeResult.latitude;
                                dto.longitude = geocodeResult.longitude;
                                console.log("[AutoGeocode] Coordinates obtained: ".concat(geocodeResult.latitude, ", ").concat(geocodeResult.longitude));
                            }
                            else {
                                console.log("[AutoGeocode] Failed to geocode address: ".concat(fullAddress));
                            }
                            return [3 /*break*/, 5];
                        case 4:
                            error_5 = _a.sent();
                            console.error('[AutoGeocode] Error during auto-geocoding:', error_5.message);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        // ==================== REFERRAL SYSTEM ====================
        /**
         * Generate or retrieve referral code for a voter
         */
        VotersService_1.prototype.generateReferralCode = function (voterId) {
            return __awaiter(this, void 0, void 0, function () {
                var db, voter, code;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, this.findOne(voterId)];
                        case 1:
                            voter = _a.sent();
                            // If voter already has a code, return it
                            if (voter.referralCode) {
                                return [2 /*return*/, voter.referralCode];
                            }
                            return [4 /*yield*/, this.createUniqueReferralCode(voter.name)];
                        case 2:
                            code = _a.sent();
                            // Update voter with new code
                            return [4 /*yield*/, db.update(schemas_1.voters).set({ referralCode: code }).where((0, drizzle_orm_1.eq)(schemas_1.voters.id, voterId))];
                        case 3:
                            // Update voter with new code
                            _a.sent();
                            return [2 /*return*/, code];
                    }
                });
            });
        };
        /**
         * Get list of voters referred by this voter
         */
        VotersService_1.prototype.getReferrals = function (voterId_1) {
            return __awaiter(this, arguments, void 0, function (voterId, page, perPage, supportLevel) {
                var db, offset, conditions, referrals, count;
                var _this = this;
                if (page === void 0) { page = 1; }
                if (perPage === void 0) { perPage = 20; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            offset = (page - 1) * perPage;
                            conditions = [(0, drizzle_orm_1.eq)(schemas_1.voters.referredBy, voterId), (0, drizzle_orm_1.isNull)(schemas_1.voters.deletedAt)];
                            if (supportLevel) {
                                conditions.push((0, drizzle_orm_1.eq)(schemas_1.voters.supportLevel, supportLevel));
                            }
                            return [4 /*yield*/, db
                                    .select()
                                    .from(schemas_1.voters)
                                    .where(drizzle_orm_1.and.apply(void 0, conditions))
                                    .limit(perPage)
                                    .offset(offset)
                                    .orderBy(schemas_1.voters.referralDate)];
                        case 1:
                            referrals = _a.sent();
                            return [4 /*yield*/, db
                                    .select({ count: (0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["cast(count(*) as integer)"], ["cast(count(*) as integer)"]))) })
                                    .from(schemas_1.voters)
                                    .where(drizzle_orm_1.and.apply(void 0, conditions))];
                        case 2:
                            count = (_a.sent())[0].count;
                            return [2 /*return*/, {
                                    data: referrals.map(function (v) { return _this.formatVoter(v); }),
                                    meta: {
                                        total: count,
                                        page: page,
                                        perPage: perPage,
                                        totalPages: Math.ceil(count / perPage),
                                    },
                                }];
                    }
                });
            });
        };
        /**
         * Get referral statistics for a voter
         */
        VotersService_1.prototype.getReferralStats = function (voterId) {
            return __awaiter(this, void 0, void 0, function () {
                var db, allReferrals, activeReferrals, now, firstDayOfMonth, thisMonthReferrals, byLevel;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, db.select().from(schemas_1.voters).where((0, drizzle_orm_1.eq)(schemas_1.voters.referredBy, voterId))];
                        case 1:
                            allReferrals = _a.sent();
                            activeReferrals = allReferrals.filter(function (r) { return !r.deletedAt; });
                            now = new Date();
                            firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                            thisMonthReferrals = activeReferrals.filter(function (r) { return r.referralDate && new Date(r.referralDate) >= firstDayOfMonth; });
                            byLevel = activeReferrals.reduce(function (acc, r) {
                                var level = r.supportLevel || 'NAO_DEFINIDO';
                                acc[level] = (acc[level] || 0) + 1;
                                return acc;
                            }, {});
                            return [2 /*return*/, {
                                    total: allReferrals.length,
                                    active: activeReferrals.length,
                                    thisMonth: thisMonthReferrals.length,
                                    byLevel: byLevel,
                                }];
                    }
                });
            });
        };
        /**
         * Register a new voter via referral code
         */
        VotersService_1.prototype.registerReferral = function (referralCode, data) {
            return __awaiter(this, void 0, void 0, function () {
                var db, referrer, newReferralCode, newVoter;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            return [4 /*yield*/, db
                                    .select()
                                    .from(schemas_1.voters)
                                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.voters.referralCode, referralCode), (0, drizzle_orm_1.isNull)(schemas_1.voters.deletedAt)))];
                        case 1:
                            referrer = (_a.sent())[0];
                            if (!referrer) {
                                throw new common_1.NotFoundException('Invalid referral code');
                            }
                            return [4 /*yield*/, this.createUniqueReferralCode(data.name)];
                        case 2:
                            newReferralCode = _a.sent();
                            return [4 /*yield*/, db
                                    .insert(schemas_1.voters)
                                    .values(__assign(__assign({}, data), { referralCode: newReferralCode, referredBy: referrer.id, referralDate: new Date() }))
                                    .returning()];
                        case 3:
                            newVoter = (_a.sent())[0];
                            // Increment referrer's count
                            return [4 /*yield*/, db
                                    .update(schemas_1.voters)
                                    .set({
                                    referredVoters: (0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["COALESCE(", ", 0) + 1"], ["COALESCE(", ", 0) + 1"])), schemas_1.voters.referredVoters),
                                })
                                    .where((0, drizzle_orm_1.eq)(schemas_1.voters.id, referrer.id))];
                        case 4:
                            // Increment referrer's count
                            _a.sent();
                            return [2 /*return*/, this.formatVoter(newVoter)];
                    }
                });
            });
        };
        /**
         * Create a unique referral code
         * Format: FIRSTNAME-LASTNAME-RANDOM (e.g., JOAO-SILVA-AB12CD)
         */
        VotersService_1.prototype.createUniqueReferralCode = function (name) {
            return __awaiter(this, void 0, void 0, function () {
                var db, attempts, maxAttempts, slug, random, code, existing, uuid;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = this.databaseService.getDb();
                            attempts = 0;
                            maxAttempts = 10;
                            _a.label = 1;
                        case 1:
                            if (!(attempts < maxAttempts)) return [3 /*break*/, 3];
                            slug = name
                                .normalize('NFD')
                                .replace(/[\u0300-\u036f]/g, '') // Remove accents
                                .substring(0, 15)
                                .toUpperCase()
                                .replace(/[^A-Z\s]/g, '')
                                .replace(/\s+/g, '-')
                                .replace(/-+/g, '-')
                                .replace(/^-|-$/g, '');
                            random = Math.random().toString(36).substring(2, 8).toUpperCase();
                            code = "".concat(slug, "-").concat(random);
                            return [4 /*yield*/, db
                                    .select({ id: schemas_1.voters.id })
                                    .from(schemas_1.voters)
                                    .where((0, drizzle_orm_1.eq)(schemas_1.voters.referralCode, code))
                                    .limit(1)];
                        case 2:
                            existing = (_a.sent())[0];
                            if (!existing) {
                                return [2 /*return*/, code];
                            }
                            attempts++;
                            return [3 /*break*/, 1];
                        case 3:
                            uuid = crypto.randomUUID().substring(0, 12).toUpperCase();
                            return [2 /*return*/, "USER-".concat(uuid)];
                    }
                });
            });
        };
        /**
         * Prepare voter data for saving to database
         * Handles stringification of JSON fields and boolean conversions
         */
        VotersService_1.prototype.prepareVoterForSave = function (dto) {
            var _a, _b, _c, _d;
            var values = __assign({}, dto);
            // Convert numeric coordinates to strings (schema expectation)
            if (values.latitude !== undefined)
                values.latitude = (_b = (_a = values.latitude) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : null;
            if (values.longitude !== undefined)
                values.longitude = (_d = (_c = values.longitude) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : null;
            // Convert booleans to SIM/NAO
            if (typeof values.hasWhatsapp === 'boolean') {
                values.hasWhatsapp = values.hasWhatsapp ? 'SIM' : 'NAO';
            }
            if (typeof values.vehicleOwnership === 'boolean') {
                values.vehicleOwnership = values.vehicleOwnership ? 'SIM' : 'NAO';
            }
            // Stringify JSON fields if they are objects/arrays
            var jsonFields = [
                'tags',
                'topIssues',
                'issuePositions',
                'seasonalActivity',
                'eventAttendance',
                'donationHistory',
                'contentPreference',
                'bestContactDay',
            ];
            for (var _i = 0, jsonFields_1 = jsonFields; _i < jsonFields_1.length; _i++) {
                var field = jsonFields_1[_i];
                if (values[field] && typeof values[field] !== 'string') {
                    values[field] = JSON.stringify(values[field]);
                }
            }
            return values;
        };
        return VotersService_1;
    }());
    __setFunctionName(_classThis, "VotersService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VotersService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VotersService = _classThis;
}();
exports.VotersService = VotersService;
var templateObject_1, templateObject_2, templateObject_3;
