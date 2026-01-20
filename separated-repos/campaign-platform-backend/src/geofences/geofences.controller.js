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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeofencesController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var GeofencesController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Geofences'), (0, common_1.Controller)('geofences')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findAll_decorators;
    var _findOne_decorators;
    var _update_decorators;
    var _remove_decorators;
    var _checkPoint_decorators;
    var _findByPoint_decorators;
    var GeofencesController = _classThis = /** @class */ (function () {
        function GeofencesController_1(geofencesService) {
            this.geofencesService = (__runInitializers(this, _instanceExtraInitializers), geofencesService);
        }
        GeofencesController_1.prototype.create = function (createGeofenceDto) {
            return this.geofencesService.create(createGeofenceDto);
        };
        GeofencesController_1.prototype.findAll = function () {
            return this.geofencesService.findAll();
        };
        GeofencesController_1.prototype.findOne = function (id) {
            return this.geofencesService.findOne(id);
        };
        GeofencesController_1.prototype.update = function (id, updateGeofenceDto) {
            return this.geofencesService.update(id, updateGeofenceDto);
        };
        GeofencesController_1.prototype.remove = function (id) {
            return this.geofencesService.remove(id);
        };
        GeofencesController_1.prototype.checkPoint = function (id, lat, lng) {
            return this.geofencesService.checkPoint(id, parseFloat(lat), parseFloat(lng));
        };
        GeofencesController_1.prototype.findByPoint = function (lat, lng) {
            return this.geofencesService.findGeofencesContainingPoint(parseFloat(lat), parseFloat(lng));
        };
        return GeofencesController_1;
    }());
    __setFunctionName(_classThis, "GeofencesController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, swagger_1.ApiOperation)({ summary: 'Create a new geofence' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Geofence created successfully' })];
        _findAll_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Get all geofences' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all geofences' })];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get a geofence by ID' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Geofence UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the geofence' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Geofence not found' })];
        _update_decorators = [(0, common_1.Patch)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update a geofence' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Geofence UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Geofence updated successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Geofence not found' })];
        _remove_decorators = [(0, common_1.Delete)(':id'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Delete a geofence (soft delete)' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Geofence UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Geofence deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Geofence not found' })];
        _checkPoint_decorators = [(0, common_1.Get)(':id/check-point'), (0, swagger_1.ApiOperation)({ summary: 'Check if a point is within a geofence' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Geofence UUID' }), (0, swagger_1.ApiQuery)({ name: 'lat', description: 'Latitude', example: -23.5505 }), (0, swagger_1.ApiQuery)({ name: 'lng', description: 'Longitude', example: -46.6333 }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns whether point is inside geofence' })];
        _findByPoint_decorators = [(0, common_1.Get)('find-by-point/location'), (0, swagger_1.ApiOperation)({ summary: 'Find all geofences containing a point' }), (0, swagger_1.ApiQuery)({ name: 'lat', description: 'Latitude', example: -23.5505 }), (0, swagger_1.ApiQuery)({ name: 'lng', description: 'Longitude', example: -46.6333 }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns geofences containing the point' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _checkPoint_decorators, { kind: "method", name: "checkPoint", static: false, private: false, access: { has: function (obj) { return "checkPoint" in obj; }, get: function (obj) { return obj.checkPoint; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findByPoint_decorators, { kind: "method", name: "findByPoint", static: false, private: false, access: { has: function (obj) { return "findByPoint" in obj; }, get: function (obj) { return obj.findByPoint; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GeofencesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GeofencesController = _classThis;
}();
exports.GeofencesController = GeofencesController;
