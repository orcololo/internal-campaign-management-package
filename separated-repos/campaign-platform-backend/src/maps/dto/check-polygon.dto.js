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
exports.CheckPolygonDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var swagger_1 = require("@nestjs/swagger");
var LatLng = function () {
    var _a;
    var _lat_decorators;
    var _lat_initializers = [];
    var _lat_extraInitializers = [];
    var _lng_decorators;
    var _lng_initializers = [];
    var _lng_extraInitializers = [];
    return _a = /** @class */ (function () {
            function LatLng() {
                this.lat = __runInitializers(this, _lat_initializers, void 0);
                this.lng = (__runInitializers(this, _lat_extraInitializers), __runInitializers(this, _lng_initializers, void 0));
                __runInitializers(this, _lng_extraInitializers);
            }
            return LatLng;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _lat_decorators = [(0, swagger_1.ApiProperty)({ description: 'Latitude', example: -23.5505 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(-90), (0, class_validator_1.Max)(90)];
            _lng_decorators = [(0, swagger_1.ApiProperty)({ description: 'Longitude', example: -46.6333 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(-180), (0, class_validator_1.Max)(180)];
            __esDecorate(null, null, _lat_decorators, { kind: "field", name: "lat", static: false, private: false, access: { has: function (obj) { return "lat" in obj; }, get: function (obj) { return obj.lat; }, set: function (obj, value) { obj.lat = value; } }, metadata: _metadata }, _lat_initializers, _lat_extraInitializers);
            __esDecorate(null, null, _lng_decorators, { kind: "field", name: "lng", static: false, private: false, access: { has: function (obj) { return "lng" in obj; }, get: function (obj) { return obj.lng; }, set: function (obj, value) { obj.lng = value; } }, metadata: _metadata }, _lng_initializers, _lng_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
var CheckPolygonDto = function () {
    var _a;
    var _pointLat_decorators;
    var _pointLat_initializers = [];
    var _pointLat_extraInitializers = [];
    var _pointLng_decorators;
    var _pointLng_initializers = [];
    var _pointLng_extraInitializers = [];
    var _polygon_decorators;
    var _polygon_initializers = [];
    var _polygon_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CheckPolygonDto() {
                this.pointLat = __runInitializers(this, _pointLat_initializers, void 0);
                this.pointLng = (__runInitializers(this, _pointLat_extraInitializers), __runInitializers(this, _pointLng_initializers, void 0));
                this.polygon = (__runInitializers(this, _pointLng_extraInitializers), __runInitializers(this, _polygon_initializers, void 0));
                __runInitializers(this, _polygon_extraInitializers);
            }
            return CheckPolygonDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _pointLat_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Latitude of point to check',
                    example: -23.5505,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(-90), (0, class_validator_1.Max)(90)];
            _pointLng_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Longitude of point to check',
                    example: -46.6333,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(-180), (0, class_validator_1.Max)(180)];
            _polygon_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Polygon coordinates (array of lat/lng points)',
                    type: [LatLng],
                    example: [
                        { lat: -23.55, lng: -46.63 },
                        { lat: -23.56, lng: -46.63 },
                        { lat: -23.56, lng: -46.64 },
                        { lat: -23.55, lng: -46.64 },
                    ],
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ArrayMinSize)(3), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return LatLng; })];
            __esDecorate(null, null, _pointLat_decorators, { kind: "field", name: "pointLat", static: false, private: false, access: { has: function (obj) { return "pointLat" in obj; }, get: function (obj) { return obj.pointLat; }, set: function (obj, value) { obj.pointLat = value; } }, metadata: _metadata }, _pointLat_initializers, _pointLat_extraInitializers);
            __esDecorate(null, null, _pointLng_decorators, { kind: "field", name: "pointLng", static: false, private: false, access: { has: function (obj) { return "pointLng" in obj; }, get: function (obj) { return obj.pointLng; }, set: function (obj, value) { obj.pointLng = value; } }, metadata: _metadata }, _pointLng_initializers, _pointLng_extraInitializers);
            __esDecorate(null, null, _polygon_decorators, { kind: "field", name: "polygon", static: false, private: false, access: { has: function (obj) { return "polygon" in obj; }, get: function (obj) { return obj.polygon; }, set: function (obj, value) { obj.polygon = value; } }, metadata: _metadata }, _polygon_initializers, _polygon_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CheckPolygonDto = CheckPolygonDto;
