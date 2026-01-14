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
exports.AnalyticsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var roles_decorator_1 = require("../common/decorators/roles.decorator");
var roles_guard_1 = require("../common/guards/roles.guard");
var AnalyticsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Analytics'), (0, common_1.Controller)('analytics'), (0, common_1.UseGuards)(roles_guard_1.RolesGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getCampaignOverview_decorators;
    var _getVoterAnalytics_decorators;
    var _getEventAnalytics_decorators;
    var _getCanvassingAnalytics_decorators;
    var _getGeographicHeatmap_decorators;
    var _getTimeSeriesData_decorators;
    var AnalyticsController = _classThis = /** @class */ (function () {
        function AnalyticsController_1(analyticsService) {
            this.analyticsService = (__runInitializers(this, _instanceExtraInitializers), analyticsService);
        }
        AnalyticsController_1.prototype.getCampaignOverview = function () {
            return this.analyticsService.getCampaignOverview();
        };
        AnalyticsController_1.prototype.getVoterAnalytics = function () {
            return this.analyticsService.getVoterAnalytics();
        };
        AnalyticsController_1.prototype.getEventAnalytics = function () {
            return this.analyticsService.getEventAnalytics();
        };
        AnalyticsController_1.prototype.getCanvassingAnalytics = function () {
            return this.analyticsService.getCanvassingAnalytics();
        };
        AnalyticsController_1.prototype.getGeographicHeatmap = function () {
            return this.analyticsService.getGeographicHeatmap();
        };
        AnalyticsController_1.prototype.getTimeSeriesData = function (startDate, endDate, metric) {
            return this.analyticsService.getTimeSeriesData(startDate, endDate, metric);
        };
        return AnalyticsController_1;
    }());
    __setFunctionName(_classThis, "AnalyticsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getCampaignOverview_decorators = [(0, common_1.Get)('overview'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA), (0, swagger_1.ApiOperation)({ summary: 'Get comprehensive campaign overview' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns campaign overview analytics' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' })];
        _getVoterAnalytics_decorators = [(0, common_1.Get)('voters'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA), (0, swagger_1.ApiOperation)({ summary: 'Get voter analytics' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns voter analytics and demographics' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' })];
        _getEventAnalytics_decorators = [(0, common_1.Get)('events'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA), (0, swagger_1.ApiOperation)({ summary: 'Get event analytics' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns event analytics' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' })];
        _getCanvassingAnalytics_decorators = [(0, common_1.Get)('canvassing'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA), (0, swagger_1.ApiOperation)({ summary: 'Get canvassing analytics' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns canvassing analytics and performance metrics' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' })];
        _getGeographicHeatmap_decorators = [(0, common_1.Get)('geographic-heatmap'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA), (0, swagger_1.ApiOperation)({ summary: 'Get geographic heatmap data for voters' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns geographic heatmap data with coordinates' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' })];
        _getTimeSeriesData_decorators = [(0, common_1.Get)('time-series'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA), (0, swagger_1.ApiOperation)({ summary: 'Get time series data for a specific metric' }), (0, swagger_1.ApiQuery)({
                name: 'startDate',
                description: 'Start date (YYYY-MM-DD)',
                example: '2024-01-01',
                required: true,
            }), (0, swagger_1.ApiQuery)({
                name: 'endDate',
                description: 'End date (YYYY-MM-DD)',
                example: '2024-12-31',
                required: true,
            }), (0, swagger_1.ApiQuery)({
                name: 'metric',
                description: 'Metric type',
                enum: ['voter-registrations', 'events', 'canvassing'],
                example: 'voter-registrations',
                required: true,
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns time series data' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' })];
        __esDecorate(_classThis, null, _getCampaignOverview_decorators, { kind: "method", name: "getCampaignOverview", static: false, private: false, access: { has: function (obj) { return "getCampaignOverview" in obj; }, get: function (obj) { return obj.getCampaignOverview; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVoterAnalytics_decorators, { kind: "method", name: "getVoterAnalytics", static: false, private: false, access: { has: function (obj) { return "getVoterAnalytics" in obj; }, get: function (obj) { return obj.getVoterAnalytics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getEventAnalytics_decorators, { kind: "method", name: "getEventAnalytics", static: false, private: false, access: { has: function (obj) { return "getEventAnalytics" in obj; }, get: function (obj) { return obj.getEventAnalytics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCanvassingAnalytics_decorators, { kind: "method", name: "getCanvassingAnalytics", static: false, private: false, access: { has: function (obj) { return "getCanvassingAnalytics" in obj; }, get: function (obj) { return obj.getCanvassingAnalytics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getGeographicHeatmap_decorators, { kind: "method", name: "getGeographicHeatmap", static: false, private: false, access: { has: function (obj) { return "getGeographicHeatmap" in obj; }, get: function (obj) { return obj.getGeographicHeatmap; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTimeSeriesData_decorators, { kind: "method", name: "getTimeSeriesData", static: false, private: false, access: { has: function (obj) { return "getTimeSeriesData" in obj; }, get: function (obj) { return obj.getTimeSeriesData; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AnalyticsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AnalyticsController = _classThis;
}();
exports.AnalyticsController = AnalyticsController;
