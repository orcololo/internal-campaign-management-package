"use strict";
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
exports.MapsService = void 0;
var common_1 = require("@nestjs/common");
var google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
var MapsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MapsService = _classThis = /** @class */ (function () {
        function MapsService_1(configService) {
            this.configService = configService;
            this.logger = new common_1.Logger(MapsService.name);
            this.apiKey = this.configService.get('GOOGLE_MAPS_API_KEY', '');
            this.client = new google_maps_services_js_1.Client({});
            if (!this.apiKey) {
                this.logger.warn('Google Maps API key not configured. Maps features will be disabled.');
            }
        }
        /**
         * Geocode an address to get coordinates
         */
        MapsService_1.prototype.geocodeAddress = function (address) {
            return __awaiter(this, void 0, void 0, function () {
                var response, result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.apiKey) {
                                this.logger.warn('Geocoding skipped: API key not configured');
                                return [2 /*return*/, null];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.geocode({
                                    params: {
                                        address: address,
                                        key: this.apiKey,
                                    },
                                })];
                        case 2:
                            response = _a.sent();
                            if (response.data.results.length === 0) {
                                this.logger.warn("No results found for address: ".concat(address));
                                return [2 /*return*/, null];
                            }
                            result = response.data.results[0];
                            return [2 /*return*/, {
                                    latitude: result.geometry.location.lat,
                                    longitude: result.geometry.location.lng,
                                    formattedAddress: result.formatted_address,
                                    placeId: result.place_id,
                                    addressComponents: result.address_components,
                                }];
                        case 3:
                            error_1 = _a.sent();
                            this.logger.error("Geocoding error for address \"".concat(address, "\":"), error_1.message);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Reverse geocode coordinates to get address
         */
        MapsService_1.prototype.reverseGeocode = function (latitude, longitude) {
            return __awaiter(this, void 0, void 0, function () {
                var response, result, components, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.apiKey) {
                                this.logger.warn('Reverse geocoding skipped: API key not configured');
                                return [2 /*return*/, null];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.reverseGeocode({
                                    params: {
                                        latlng: { lat: latitude, lng: longitude },
                                        key: this.apiKey,
                                    },
                                })];
                        case 2:
                            response = _a.sent();
                            if (response.data.results.length === 0) {
                                return [2 /*return*/, null];
                            }
                            result = response.data.results[0];
                            components = result.address_components;
                            return [2 /*return*/, {
                                    formattedAddress: result.formatted_address,
                                    city: this.extractComponent(components, 'administrative_area_level_2'),
                                    state: this.extractComponent(components, 'administrative_area_level_1', true),
                                    country: this.extractComponent(components, 'country'),
                                    zipCode: this.extractComponent(components, 'postal_code'),
                                    neighborhood: this.extractComponent(components, 'sublocality_level_1'),
                                }];
                        case 3:
                            error_2 = _a.sent();
                            this.logger.error("Reverse geocoding error:", error_2.message);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Autocomplete address suggestions
         */
        MapsService_1.prototype.autocompleteAddress = function (input_1) {
            return __awaiter(this, arguments, void 0, function (input, country) {
                var response, error_3;
                if (country === void 0) { country = 'BR'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.apiKey) {
                                this.logger.warn('Autocomplete skipped: API key not configured');
                                return [2 /*return*/, []];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.placeAutocomplete({
                                    params: {
                                        input: input,
                                        key: this.apiKey,
                                        components: ["country:".concat(country)],
                                        language: 'pt-BR',
                                    },
                                })];
                        case 2:
                            response = _a.sent();
                            return [2 /*return*/, response.data.predictions];
                        case 3:
                            error_3 = _a.sent();
                            this.logger.error("Autocomplete error:", error_3.message);
                            return [2 /*return*/, []];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get place details by place ID
         */
        MapsService_1.prototype.getPlaceDetails = function (placeId) {
            return __awaiter(this, void 0, void 0, function () {
                var response, result, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.apiKey) {
                                this.logger.warn('Place details skipped: API key not configured');
                                return [2 /*return*/, null];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.placeDetails({
                                    params: {
                                        place_id: placeId,
                                        key: this.apiKey,
                                        fields: ['formatted_address', 'geometry', 'address_components'],
                                    },
                                })];
                        case 2:
                            response = _a.sent();
                            result = response.data.result;
                            if (!result.geometry) {
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, {
                                    latitude: result.geometry.location.lat,
                                    longitude: result.geometry.location.lng,
                                    formattedAddress: result.formatted_address || '',
                                    placeId: result.place_id,
                                    addressComponents: result.address_components,
                                }];
                        case 3:
                            error_4 = _a.sent();
                            this.logger.error("Place details error:", error_4.message);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Calculate distance between two points using Haversine formula
         * Returns distance in kilometers
         */
        MapsService_1.prototype.calculateDistance = function (lat1, lon1, lat2, lon2) {
            var R = 6371; // Earth's radius in km
            var dLat = this.toRadians(lat2 - lat1);
            var dLon = this.toRadians(lon2 - lon1);
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(this.toRadians(lat1)) *
                    Math.cos(this.toRadians(lat2)) *
                    Math.sin(dLon / 2) *
                    Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };
        /**
         * Check if a point is within a circular geofence
         */
        MapsService_1.prototype.isPointInCircle = function (pointLat, pointLon, centerLat, centerLon, radiusKm) {
            var distance = this.calculateDistance(pointLat, pointLon, centerLat, centerLon);
            return distance <= radiusKm;
        };
        /**
         * Check if a point is within a polygon geofence
         * Uses ray casting algorithm
         */
        MapsService_1.prototype.isPointInPolygon = function (pointLat, pointLon, polygon) {
            var inside = false;
            var x = pointLon;
            var y = pointLat;
            for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                var xi = polygon[i].lng;
                var yi = polygon[i].lat;
                var xj = polygon[j].lng;
                var yj = polygon[j].lat;
                var intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
                if (intersect)
                    inside = !inside;
            }
            return inside;
        };
        /**
         * Extract component from Google Maps address components
         */
        MapsService_1.prototype.extractComponent = function (components, type, shortName) {
            if (shortName === void 0) { shortName = false; }
            var component = components.find(function (c) { return c.types.includes(type); });
            return component ? (shortName ? component.short_name : component.long_name) : undefined;
        };
        /**
         * Convert degrees to radians
         */
        MapsService_1.prototype.toRadians = function (degrees) {
            return degrees * (Math.PI / 180);
        };
        return MapsService_1;
    }());
    __setFunctionName(_classThis, "MapsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MapsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MapsService = _classThis;
}();
exports.MapsService = MapsService;
