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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var MapsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Maps'), (0, common_1.Controller)('maps'), (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true }))];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _geocode_decorators;
    var _reverseGeocode_decorators;
    var _autocomplete_decorators;
    var _placeDetails_decorators;
    var _calculateDistance_decorators;
    var _checkGeofence_decorators;
    var _checkPolygon_decorators;
    var MapsController = _classThis = /** @class */ (function () {
        function MapsController_1(mapsService) {
            this.mapsService = (__runInitializers(this, _instanceExtraInitializers), mapsService);
        }
        MapsController_1.prototype.geocode = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.mapsService.geocodeAddress(dto.address)];
                });
            });
        };
        MapsController_1.prototype.reverseGeocode = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.mapsService.reverseGeocode(dto.lat, dto.lng)];
                });
            });
        };
        MapsController_1.prototype.autocomplete = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.mapsService.autocompleteAddress(dto.input, dto.country || 'BR')];
                });
            });
        };
        MapsController_1.prototype.placeDetails = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.mapsService.getPlaceDetails(dto.placeId)];
                });
            });
        };
        MapsController_1.prototype.calculateDistance = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var distance;
                return __generator(this, function (_a) {
                    distance = this.mapsService.calculateDistance(dto.lat1, dto.lng1, dto.lat2, dto.lng2);
                    return [2 /*return*/, { distance: distance, unit: 'km' }];
                });
            });
        };
        MapsController_1.prototype.checkGeofence = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var isInside;
                return __generator(this, function (_a) {
                    isInside = this.mapsService.isPointInCircle(dto.pointLat, dto.pointLng, dto.centerLat, dto.centerLng, dto.radiusKm);
                    return [2 /*return*/, { isInside: isInside }];
                });
            });
        };
        MapsController_1.prototype.checkPolygon = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var isInside;
                return __generator(this, function (_a) {
                    isInside = this.mapsService.isPointInPolygon(dto.pointLat, dto.pointLng, dto.polygon);
                    return [2 /*return*/, { isInside: isInside }];
                });
            });
        };
        return MapsController_1;
    }());
    __setFunctionName(_classThis, "MapsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _geocode_decorators = [(0, common_1.Get)('geocode'), (0, swagger_1.ApiOperation)({ summary: 'Geocode an address to get coordinates' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Returns coordinates and formatted address',
                schema: {
                    example: {
                        latitude: -23.5505,
                        longitude: -46.6333,
                        formattedAddress: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP, Brazil',
                        placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
                    },
                },
            })];
        _reverseGeocode_decorators = [(0, common_1.Get)('reverse-geocode'), (0, swagger_1.ApiOperation)({ summary: 'Reverse geocode coordinates to get address' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Returns formatted address and components',
                schema: {
                    example: {
                        formattedAddress: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP, Brazil',
                        city: 'São Paulo',
                        state: 'SP',
                        country: 'Brazil',
                        zipCode: '01310-100',
                        neighborhood: 'Bela Vista',
                    },
                },
            })];
        _autocomplete_decorators = [(0, common_1.Get)('autocomplete'), (0, swagger_1.ApiOperation)({ summary: 'Get address autocomplete suggestions' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Returns autocomplete suggestions',
                schema: {
                    example: [
                        {
                            description: 'Av. Paulista - São Paulo, Brazil',
                            place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
                        },
                    ],
                },
            })];
        _placeDetails_decorators = [(0, common_1.Get)('place-details'), (0, swagger_1.ApiOperation)({ summary: 'Get place details by place ID' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Returns place details',
                schema: {
                    example: {
                        latitude: -23.5505,
                        longitude: -46.6333,
                        formattedAddress: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP, Brazil',
                        placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
                    },
                },
            })];
        _calculateDistance_decorators = [(0, common_1.Post)('distance'), (0, swagger_1.ApiOperation)({ summary: 'Calculate distance between two points using Haversine formula' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Returns distance in kilometers',
                schema: {
                    example: {
                        distance: 1.85,
                        unit: 'km',
                    },
                },
            })];
        _checkGeofence_decorators = [(0, common_1.Post)('check-geofence'), (0, swagger_1.ApiOperation)({ summary: 'Check if a point is within a circular geofence' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Returns whether point is inside geofence',
                schema: {
                    example: {
                        isInside: true,
                    },
                },
            })];
        _checkPolygon_decorators = [(0, common_1.Post)('check-polygon'), (0, swagger_1.ApiOperation)({ summary: 'Check if a point is within a polygon geofence' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Returns whether point is inside polygon',
                schema: {
                    example: {
                        isInside: true,
                    },
                },
            })];
        __esDecorate(_classThis, null, _geocode_decorators, { kind: "method", name: "geocode", static: false, private: false, access: { has: function (obj) { return "geocode" in obj; }, get: function (obj) { return obj.geocode; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _reverseGeocode_decorators, { kind: "method", name: "reverseGeocode", static: false, private: false, access: { has: function (obj) { return "reverseGeocode" in obj; }, get: function (obj) { return obj.reverseGeocode; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _autocomplete_decorators, { kind: "method", name: "autocomplete", static: false, private: false, access: { has: function (obj) { return "autocomplete" in obj; }, get: function (obj) { return obj.autocomplete; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _placeDetails_decorators, { kind: "method", name: "placeDetails", static: false, private: false, access: { has: function (obj) { return "placeDetails" in obj; }, get: function (obj) { return obj.placeDetails; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _calculateDistance_decorators, { kind: "method", name: "calculateDistance", static: false, private: false, access: { has: function (obj) { return "calculateDistance" in obj; }, get: function (obj) { return obj.calculateDistance; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _checkGeofence_decorators, { kind: "method", name: "checkGeofence", static: false, private: false, access: { has: function (obj) { return "checkGeofence" in obj; }, get: function (obj) { return obj.checkGeofence; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _checkPolygon_decorators, { kind: "method", name: "checkPolygon", static: false, private: false, access: { has: function (obj) { return "checkPolygon" in obj; }, get: function (obj) { return obj.checkPolygon; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MapsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MapsController = _classThis;
}();
exports.MapsController = MapsController;
