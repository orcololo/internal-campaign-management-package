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
exports.CheckGeofenceDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var CheckGeofenceDto = function () {
    var _a;
    var _pointLat_decorators;
    var _pointLat_initializers = [];
    var _pointLat_extraInitializers = [];
    var _pointLng_decorators;
    var _pointLng_initializers = [];
    var _pointLng_extraInitializers = [];
    var _centerLat_decorators;
    var _centerLat_initializers = [];
    var _centerLat_extraInitializers = [];
    var _centerLng_decorators;
    var _centerLng_initializers = [];
    var _centerLng_extraInitializers = [];
    var _radiusKm_decorators;
    var _radiusKm_initializers = [];
    var _radiusKm_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CheckGeofenceDto() {
                this.pointLat = __runInitializers(this, _pointLat_initializers, void 0);
                this.pointLng = (__runInitializers(this, _pointLat_extraInitializers), __runInitializers(this, _pointLng_initializers, void 0));
                this.centerLat = (__runInitializers(this, _pointLng_extraInitializers), __runInitializers(this, _centerLat_initializers, void 0));
                this.centerLng = (__runInitializers(this, _centerLat_extraInitializers), __runInitializers(this, _centerLng_initializers, void 0));
                this.radiusKm = (__runInitializers(this, _centerLng_extraInitializers), __runInitializers(this, _radiusKm_initializers, void 0));
                __runInitializers(this, _radiusKm_extraInitializers);
            }
            return CheckGeofenceDto;
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
            _centerLat_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Latitude of geofence center',
                    example: -23.55,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(-90), (0, class_validator_1.Max)(90)];
            _centerLng_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Longitude of geofence center',
                    example: -46.63,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(-180), (0, class_validator_1.Max)(180)];
            _radiusKm_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Geofence radius in kilometers',
                    example: 1.5,
                    minimum: 0,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _pointLat_decorators, { kind: "field", name: "pointLat", static: false, private: false, access: { has: function (obj) { return "pointLat" in obj; }, get: function (obj) { return obj.pointLat; }, set: function (obj, value) { obj.pointLat = value; } }, metadata: _metadata }, _pointLat_initializers, _pointLat_extraInitializers);
            __esDecorate(null, null, _pointLng_decorators, { kind: "field", name: "pointLng", static: false, private: false, access: { has: function (obj) { return "pointLng" in obj; }, get: function (obj) { return obj.pointLng; }, set: function (obj, value) { obj.pointLng = value; } }, metadata: _metadata }, _pointLng_initializers, _pointLng_extraInitializers);
            __esDecorate(null, null, _centerLat_decorators, { kind: "field", name: "centerLat", static: false, private: false, access: { has: function (obj) { return "centerLat" in obj; }, get: function (obj) { return obj.centerLat; }, set: function (obj, value) { obj.centerLat = value; } }, metadata: _metadata }, _centerLat_initializers, _centerLat_extraInitializers);
            __esDecorate(null, null, _centerLng_decorators, { kind: "field", name: "centerLng", static: false, private: false, access: { has: function (obj) { return "centerLng" in obj; }, get: function (obj) { return obj.centerLng; }, set: function (obj, value) { obj.centerLng = value; } }, metadata: _metadata }, _centerLng_initializers, _centerLng_extraInitializers);
            __esDecorate(null, null, _radiusKm_decorators, { kind: "field", name: "radiusKm", static: false, private: false, access: { has: function (obj) { return "radiusKm" in obj; }, get: function (obj) { return obj.radiusKm; }, set: function (obj, value) { obj.radiusKm = value; } }, metadata: _metadata }, _radiusKm_initializers, _radiusKm_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CheckGeofenceDto = CheckGeofenceDto;
