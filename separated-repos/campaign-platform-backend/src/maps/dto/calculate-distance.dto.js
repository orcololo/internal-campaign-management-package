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
exports.CalculateDistanceDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var CalculateDistanceDto = function () {
    var _a;
    var _lat1_decorators;
    var _lat1_initializers = [];
    var _lat1_extraInitializers = [];
    var _lng1_decorators;
    var _lng1_initializers = [];
    var _lng1_extraInitializers = [];
    var _lat2_decorators;
    var _lat2_initializers = [];
    var _lat2_extraInitializers = [];
    var _lng2_decorators;
    var _lng2_initializers = [];
    var _lng2_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CalculateDistanceDto() {
                this.lat1 = __runInitializers(this, _lat1_initializers, void 0);
                this.lng1 = (__runInitializers(this, _lat1_extraInitializers), __runInitializers(this, _lng1_initializers, void 0));
                this.lat2 = (__runInitializers(this, _lng1_extraInitializers), __runInitializers(this, _lat2_initializers, void 0));
                this.lng2 = (__runInitializers(this, _lat2_extraInitializers), __runInitializers(this, _lng2_initializers, void 0));
                __runInitializers(this, _lng2_extraInitializers);
            }
            return CalculateDistanceDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _lat1_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Latitude of first point',
                    example: -23.5505,
                    minimum: -90,
                    maximum: 90,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(-90), (0, class_validator_1.Max)(90)];
            _lng1_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Longitude of first point',
                    example: -46.6333,
                    minimum: -180,
                    maximum: 180,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(-180), (0, class_validator_1.Max)(180)];
            _lat2_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Latitude of second point',
                    example: -23.5629,
                    minimum: -90,
                    maximum: 90,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(-90), (0, class_validator_1.Max)(90)];
            _lng2_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Longitude of second point',
                    example: -46.6544,
                    minimum: -180,
                    maximum: 180,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(-180), (0, class_validator_1.Max)(180)];
            __esDecorate(null, null, _lat1_decorators, { kind: "field", name: "lat1", static: false, private: false, access: { has: function (obj) { return "lat1" in obj; }, get: function (obj) { return obj.lat1; }, set: function (obj, value) { obj.lat1 = value; } }, metadata: _metadata }, _lat1_initializers, _lat1_extraInitializers);
            __esDecorate(null, null, _lng1_decorators, { kind: "field", name: "lng1", static: false, private: false, access: { has: function (obj) { return "lng1" in obj; }, get: function (obj) { return obj.lng1; }, set: function (obj, value) { obj.lng1 = value; } }, metadata: _metadata }, _lng1_initializers, _lng1_extraInitializers);
            __esDecorate(null, null, _lat2_decorators, { kind: "field", name: "lat2", static: false, private: false, access: { has: function (obj) { return "lat2" in obj; }, get: function (obj) { return obj.lat2; }, set: function (obj, value) { obj.lat2 = value; } }, metadata: _metadata }, _lat2_initializers, _lat2_extraInitializers);
            __esDecorate(null, null, _lng2_decorators, { kind: "field", name: "lng2", static: false, private: false, access: { has: function (obj) { return "lng2" in obj; }, get: function (obj) { return obj.lng2; }, set: function (obj, value) { obj.lng2 = value; } }, metadata: _metadata }, _lng2_initializers, _lng2_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CalculateDistanceDto = CalculateDistanceDto;
