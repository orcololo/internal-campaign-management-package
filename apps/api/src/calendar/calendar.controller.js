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
exports.CalendarController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var roles_decorator_1 = require("../common/decorators/roles.decorator");
var roles_guard_1 = require("../common/guards/roles.guard");
var CalendarController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Calendar'), (0, common_1.Controller)('calendar'), (0, common_1.UseGuards)(roles_guard_1.RolesGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findAll_decorators;
    var _getStatistics_decorators;
    var _getUpcoming_decorators;
    var _getByDateRange_decorators;
    var _checkConflicts_decorators;
    var _findOne_decorators;
    var _update_decorators;
    var _remove_decorators;
    var CalendarController = _classThis = /** @class */ (function () {
        function CalendarController_1(calendarService) {
            this.calendarService = (__runInitializers(this, _instanceExtraInitializers), calendarService);
        }
        CalendarController_1.prototype.create = function (createEventDto) {
            return this.calendarService.create(createEventDto);
        };
        CalendarController_1.prototype.findAll = function (query) {
            return this.calendarService.findAll(query);
        };
        CalendarController_1.prototype.getStatistics = function () {
            return this.calendarService.getStatistics();
        };
        CalendarController_1.prototype.getUpcoming = function (limit) {
            return this.calendarService.getUpcomingEvents(limit ? parseInt(limit) : 10);
        };
        CalendarController_1.prototype.getByDateRange = function (startDate, endDate) {
            return this.calendarService.getEventsByDateRange(startDate, endDate);
        };
        CalendarController_1.prototype.checkConflicts = function (body) {
            return this.calendarService.checkConflicts(body.startDate, body.startTime, body.endDate, body.endTime, body.excludeEventId);
        };
        CalendarController_1.prototype.findOne = function (id) {
            return this.calendarService.findOne(id);
        };
        CalendarController_1.prototype.update = function (id, updateEventDto) {
            return this.calendarService.update(id, updateEventDto);
        };
        CalendarController_1.prototype.remove = function (id) {
            return this.calendarService.remove(id);
        };
        return CalendarController_1;
    }());
    __setFunctionName(_classThis, "CalendarController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA), (0, swagger_1.ApiOperation)({ summary: 'Create a new event' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Event created successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation failed' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflict - event conflicts with existing events' })];
        _findAll_decorators = [(0, common_1.Get)(), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA, roles_decorator_1.UserRole.ESCRITORIO), (0, swagger_1.ApiOperation)({ summary: 'Get all events with pagination and filtering' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns paginated list of events' })];
        _getStatistics_decorators = [(0, common_1.Get)('statistics'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA), (0, swagger_1.ApiOperation)({ summary: 'Get event statistics' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns event statistics' })];
        _getUpcoming_decorators = [(0, common_1.Get)('upcoming'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA, roles_decorator_1.UserRole.ESCRITORIO), (0, swagger_1.ApiOperation)({ summary: 'Get upcoming events' }), (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Max events to return', example: 10, required: false }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns upcoming events' })];
        _getByDateRange_decorators = [(0, common_1.Get)('date-range'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA, roles_decorator_1.UserRole.ESCRITORIO), (0, swagger_1.ApiOperation)({ summary: 'Get events by date range' }), (0, swagger_1.ApiQuery)({ name: 'startDate', description: 'Start date', example: '2024-03-01', required: true }), (0, swagger_1.ApiQuery)({ name: 'endDate', description: 'End date', example: '2024-03-31', required: true }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns events in date range' })];
        _checkConflicts_decorators = [(0, common_1.Post)('check-conflicts'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA), (0, swagger_1.ApiOperation)({ summary: 'Check for scheduling conflicts' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns conflicting events if any' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' })];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA, roles_decorator_1.UserRole.ESCRITORIO), (0, swagger_1.ApiOperation)({ summary: 'Get an event by ID' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Event UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the event' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Event not found' })];
        _update_decorators = [(0, common_1.Patch)(':id'), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA, roles_decorator_1.UserRole.LIDERANCA), (0, swagger_1.ApiOperation)({ summary: 'Update an event' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Event UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Event updated successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Event not found' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation failed' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflict - event update would create conflicts' })];
        _remove_decorators = [(0, common_1.Delete)(':id'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CANDIDATO, roles_decorator_1.UserRole.ESTRATEGISTA), (0, swagger_1.ApiOperation)({ summary: 'Delete an event (soft delete)' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Event UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Event deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Event not found' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStatistics_decorators, { kind: "method", name: "getStatistics", static: false, private: false, access: { has: function (obj) { return "getStatistics" in obj; }, get: function (obj) { return obj.getStatistics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getUpcoming_decorators, { kind: "method", name: "getUpcoming", static: false, private: false, access: { has: function (obj) { return "getUpcoming" in obj; }, get: function (obj) { return obj.getUpcoming; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getByDateRange_decorators, { kind: "method", name: "getByDateRange", static: false, private: false, access: { has: function (obj) { return "getByDateRange" in obj; }, get: function (obj) { return obj.getByDateRange; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _checkConflicts_decorators, { kind: "method", name: "checkConflicts", static: false, private: false, access: { has: function (obj) { return "checkConflicts" in obj; }, get: function (obj) { return obj.checkConflicts; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CalendarController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CalendarController = _classThis;
}();
exports.CalendarController = CalendarController;
