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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGeofenceDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var PolygonPoint = function () {
    var _a;
    var _lat_decorators;
    var _lat_initializers = [];
    var _lat_extraInitializers = [];
    var _lng_decorators;
    var _lng_initializers = [];
    var _lng_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PolygonPoint() {
                this.lat = __runInitializers(this, _lat_initializers, void 0);
                this.lng = (__runInitializers(this, _lat_extraInitializers), __runInitializers(this, _lng_initializers, void 0));
                __runInitializers(this, _lng_extraInitializers);
            }
            return PolygonPoint;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _lat_decorators = [(0, swagger_1.ApiProperty)({ description: 'Latitude', example: -23.5505 }), (0, class_validator_1.IsNumber)()];
            _lng_decorators = [(0, swagger_1.ApiProperty)({ description: 'Longitude', example: -46.6333 }), (0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _lat_decorators, { kind: "field", name: "lat", static: false, private: false, access: { has: function (obj) { return "lat" in obj; }, get: function (obj) { return obj.lat; }, set: function (obj, value) { obj.lat = value; } }, metadata: _metadata }, _lat_initializers, _lat_extraInitializers);
            __esDecorate(null, null, _lng_decorators, { kind: "field", name: "lng", static: false, private: false, access: { has: function (obj) { return "lng" in obj; }, get: function (obj) { return obj.lng; }, set: function (obj, value) { obj.lng = value; } }, metadata: _metadata }, _lng_initializers, _lng_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
var CreateGeofenceDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _centerLatitude_decorators;
    var _centerLatitude_initializers = [];
    var _centerLatitude_extraInitializers = [];
    var _centerLongitude_decorators;
    var _centerLongitude_initializers = [];
    var _centerLongitude_extraInitializers = [];
    var _radiusKm_decorators;
    var _radiusKm_initializers = [];
    var _radiusKm_extraInitializers = [];
    var _polygon_decorators;
    var _polygon_initializers = [];
    var _polygon_extraInitializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _city_extraInitializers = [];
    var _state_decorators;
    var _state_initializers = [];
    var _state_extraInitializers = [];
    var _neighborhood_decorators;
    var _neighborhood_initializers = [];
    var _neighborhood_extraInitializers = [];
    var _color_decorators;
    var _color_initializers = [];
    var _color_extraInitializers = [];
    var _tags_decorators;
    var _tags_initializers = [];
    var _tags_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateGeofenceDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.type = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                // Circle properties
                this.centerLatitude = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _centerLatitude_initializers, void 0));
                this.centerLongitude = (__runInitializers(this, _centerLatitude_extraInitializers), __runInitializers(this, _centerLongitude_initializers, void 0));
                this.radiusKm = (__runInitializers(this, _centerLongitude_extraInitializers), __runInitializers(this, _radiusKm_initializers, void 0));
                // Polygon properties
                this.polygon = (__runInitializers(this, _radiusKm_extraInitializers), __runInitializers(this, _polygon_initializers, void 0));
                // Location info
                this.city = (__runInitializers(this, _polygon_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                this.state = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _state_initializers, void 0));
                this.neighborhood = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _neighborhood_initializers, void 0));
                this.color = (__runInitializers(this, _neighborhood_extraInitializers), __runInitializers(this, _color_initializers, void 0));
                this.tags = (__runInitializers(this, _color_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                this.notes = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
            return CreateGeofenceDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Geofence name', example: 'Zona Central' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Description', example: 'Região central da cidade' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _type_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Geofence type',
                    enum: ['CIRCLE', 'POLYGON'],
                    example: 'CIRCLE',
                }), (0, class_validator_1.IsEnum)(['CIRCLE', 'POLYGON'])];
            _centerLatitude_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Center latitude (for CIRCLE)', example: -23.5505 }), (0, class_validator_1.ValidateIf)(function (o) { return o.type === 'CIRCLE'; }), (0, class_validator_1.IsNumber)()];
            _centerLongitude_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Center longitude (for CIRCLE)', example: -46.6333 }), (0, class_validator_1.ValidateIf)(function (o) { return o.type === 'CIRCLE'; }), (0, class_validator_1.IsNumber)()];
            _radiusKm_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Radius in kilometers (for CIRCLE)', example: 2.5 }), (0, class_validator_1.ValidateIf)(function (o) { return o.type === 'CIRCLE'; }), (0, class_validator_1.IsNumber)()];
            _polygon_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Polygon points (for POLYGON)',
                    type: [PolygonPoint],
                    example: [
                        { lat: -23.5505, lng: -46.6333 },
                        { lat: -23.5515, lng: -46.6343 },
                        { lat: -23.5525, lng: -46.6323 },
                    ],
                }), (0, class_validator_1.ValidateIf)(function (o) { return o.type === 'POLYGON'; }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return PolygonPoint; })];
            _city_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'City', example: 'São Paulo' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(100)];
            _state_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'State code', example: 'SP' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2)];
            _neighborhood_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Neighborhood', example: 'Centro' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(100)];
            _color_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Color (hex)', example: '#3B82F6' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(7)];
            _tags_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Tags (JSON array)',
                    example: '["prioridade", "zona_eleitoral_1"]',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Notes', example: 'Área com alta concentração de eleitores' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _centerLatitude_decorators, { kind: "field", name: "centerLatitude", static: false, private: false, access: { has: function (obj) { return "centerLatitude" in obj; }, get: function (obj) { return obj.centerLatitude; }, set: function (obj, value) { obj.centerLatitude = value; } }, metadata: _metadata }, _centerLatitude_initializers, _centerLatitude_extraInitializers);
            __esDecorate(null, null, _centerLongitude_decorators, { kind: "field", name: "centerLongitude", static: false, private: false, access: { has: function (obj) { return "centerLongitude" in obj; }, get: function (obj) { return obj.centerLongitude; }, set: function (obj, value) { obj.centerLongitude = value; } }, metadata: _metadata }, _centerLongitude_initializers, _centerLongitude_extraInitializers);
            __esDecorate(null, null, _radiusKm_decorators, { kind: "field", name: "radiusKm", static: false, private: false, access: { has: function (obj) { return "radiusKm" in obj; }, get: function (obj) { return obj.radiusKm; }, set: function (obj, value) { obj.radiusKm = value; } }, metadata: _metadata }, _radiusKm_initializers, _radiusKm_extraInitializers);
            __esDecorate(null, null, _polygon_decorators, { kind: "field", name: "polygon", static: false, private: false, access: { has: function (obj) { return "polygon" in obj; }, get: function (obj) { return obj.polygon; }, set: function (obj, value) { obj.polygon = value; } }, metadata: _metadata }, _polygon_initializers, _polygon_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: function (obj) { return "state" in obj; }, get: function (obj) { return obj.state; }, set: function (obj, value) { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
            __esDecorate(null, null, _neighborhood_decorators, { kind: "field", name: "neighborhood", static: false, private: false, access: { has: function (obj) { return "neighborhood" in obj; }, get: function (obj) { return obj.neighborhood; }, set: function (obj, value) { obj.neighborhood = value; } }, metadata: _metadata }, _neighborhood_initializers, _neighborhood_extraInitializers);
            __esDecorate(null, null, _color_decorators, { kind: "field", name: "color", static: false, private: false, access: { has: function (obj) { return "color" in obj; }, get: function (obj) { return obj.color; }, set: function (obj, value) { obj.color = value; } }, metadata: _metadata }, _color_initializers, _color_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: function (obj) { return "tags" in obj; }, get: function (obj) { return obj.tags; }, set: function (obj, value) { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateGeofenceDto = CreateGeofenceDto;
