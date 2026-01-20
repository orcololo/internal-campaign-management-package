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
exports.CreateReportDto = exports.SortDto = exports.FilterDto = exports.SortDirection = exports.FilterOperator = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var swagger_1 = require("@nestjs/swagger");
// Enums from schema
var FilterOperator;
(function (FilterOperator) {
    FilterOperator["EQUALS"] = "equals";
    FilterOperator["NOT_EQUALS"] = "not_equals";
    FilterOperator["CONTAINS"] = "contains";
    FilterOperator["NOT_CONTAINS"] = "not_contains";
    FilterOperator["STARTS_WITH"] = "starts_with";
    FilterOperator["ENDS_WITH"] = "ends_with";
    FilterOperator["IN"] = "in";
    FilterOperator["NOT_IN"] = "not_in";
    FilterOperator["GREATER_THAN"] = "greater_than";
    FilterOperator["GREATER_THAN_OR_EQUAL"] = "greater_than_or_equal";
    FilterOperator["LESS_THAN"] = "less_than";
    FilterOperator["LESS_THAN_OR_EQUAL"] = "less_than_or_equal";
    FilterOperator["BETWEEN"] = "between";
    FilterOperator["IS_NULL"] = "is_null";
    FilterOperator["IS_NOT_NULL"] = "is_not_null";
})(FilterOperator || (exports.FilterOperator = FilterOperator = {}));
var SortDirection;
(function (SortDirection) {
    SortDirection["ASC"] = "asc";
    SortDirection["DESC"] = "desc";
})(SortDirection || (exports.SortDirection = SortDirection = {}));
var FilterDto = function () {
    var _a;
    var _field_decorators;
    var _field_initializers = [];
    var _field_extraInitializers = [];
    var _operator_decorators;
    var _operator_initializers = [];
    var _operator_extraInitializers = [];
    var _value_decorators;
    var _value_initializers = [];
    var _value_extraInitializers = [];
    return _a = /** @class */ (function () {
            function FilterDto() {
                this.field = __runInitializers(this, _field_initializers, void 0);
                this.operator = (__runInitializers(this, _field_extraInitializers), __runInitializers(this, _operator_initializers, void 0));
                this.value = (__runInitializers(this, _operator_extraInitializers), __runInitializers(this, _value_initializers, void 0));
                __runInitializers(this, _value_extraInitializers);
            }
            return FilterDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _field_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Field name to filter on',
                    example: 'supportLevel',
                }), (0, class_validator_1.IsString)()];
            _operator_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Filter operator',
                    enum: FilterOperator,
                    example: FilterOperator.EQUALS,
                }), (0, class_validator_1.IsEnum)(FilterOperator)];
            _value_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Filter value (can be string, number, boolean, or array)',
                    example: 'FAVORAVEL',
                })];
            __esDecorate(null, null, _field_decorators, { kind: "field", name: "field", static: false, private: false, access: { has: function (obj) { return "field" in obj; }, get: function (obj) { return obj.field; }, set: function (obj, value) { obj.field = value; } }, metadata: _metadata }, _field_initializers, _field_extraInitializers);
            __esDecorate(null, null, _operator_decorators, { kind: "field", name: "operator", static: false, private: false, access: { has: function (obj) { return "operator" in obj; }, get: function (obj) { return obj.operator; }, set: function (obj, value) { obj.operator = value; } }, metadata: _metadata }, _operator_initializers, _operator_extraInitializers);
            __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: function (obj) { return "value" in obj; }, get: function (obj) { return obj.value; }, set: function (obj, value) { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.FilterDto = FilterDto;
var SortDto = function () {
    var _a;
    var _field_decorators;
    var _field_initializers = [];
    var _field_extraInitializers = [];
    var _direction_decorators;
    var _direction_initializers = [];
    var _direction_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SortDto() {
                this.field = __runInitializers(this, _field_initializers, void 0);
                this.direction = (__runInitializers(this, _field_extraInitializers), __runInitializers(this, _direction_initializers, void 0));
                __runInitializers(this, _direction_extraInitializers);
            }
            return SortDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _field_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Field name to sort by',
                    example: 'name',
                }), (0, class_validator_1.IsString)()];
            _direction_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Sort direction',
                    enum: SortDirection,
                    example: SortDirection.ASC,
                }), (0, class_validator_1.IsEnum)(SortDirection)];
            __esDecorate(null, null, _field_decorators, { kind: "field", name: "field", static: false, private: false, access: { has: function (obj) { return "field" in obj; }, get: function (obj) { return obj.field; }, set: function (obj, value) { obj.field = value; } }, metadata: _metadata }, _field_initializers, _field_extraInitializers);
            __esDecorate(null, null, _direction_decorators, { kind: "field", name: "direction", static: false, private: false, access: { has: function (obj) { return "direction" in obj; }, get: function (obj) { return obj.direction; }, set: function (obj, value) { obj.direction = value; } }, metadata: _metadata }, _direction_initializers, _direction_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SortDto = SortDto;
var CreateReportDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _filters_decorators;
    var _filters_initializers = [];
    var _filters_extraInitializers = [];
    var _sorting_decorators;
    var _sorting_initializers = [];
    var _sorting_extraInitializers = [];
    var _columns_decorators;
    var _columns_initializers = [];
    var _columns_extraInitializers = [];
    var _isPublic_decorators;
    var _isPublic_initializers = [];
    var _isPublic_extraInitializers = [];
    var _scheduleConfig_decorators;
    var _scheduleConfig_initializers = [];
    var _scheduleConfig_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateReportDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.filters = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _filters_initializers, void 0));
                this.sorting = (__runInitializers(this, _filters_extraInitializers), __runInitializers(this, _sorting_initializers, void 0));
                this.columns = (__runInitializers(this, _sorting_extraInitializers), __runInitializers(this, _columns_initializers, void 0));
                this.isPublic = (__runInitializers(this, _columns_extraInitializers), __runInitializers(this, _isPublic_initializers, void 0));
                this.scheduleConfig = (__runInitializers(this, _isPublic_extraInitializers), __runInitializers(this, _scheduleConfig_initializers, void 0));
                __runInitializers(this, _scheduleConfig_extraInitializers);
            }
            return CreateReportDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Report name',
                    example: 'Eleitores Favoráveis - Janeiro 2026',
                    minLength: 3,
                    maxLength: 255,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Report description',
                    example: 'Relatório de eleitores com nível de apoio favorável',
                    maxLength: 1000,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _filters_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Array of filters to apply',
                    type: [FilterDto],
                    example: [
                        {
                            field: 'supportLevel',
                            operator: 'equals',
                            value: 'FAVORAVEL',
                        },
                    ],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return FilterDto; })];
            _sorting_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Array of sort rules',
                    type: [SortDto],
                    example: [
                        {
                            field: 'name',
                            direction: 'asc',
                        },
                    ],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return SortDto; })];
            _columns_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Array of field names to include in report',
                    type: [String],
                    example: ['name', 'email', 'phone', 'supportLevel', 'city', 'state'],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _isPublic_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Whether this report is public',
                    example: false,
                }), (0, class_validator_1.IsOptional)()];
            _scheduleConfig_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Scheduling configuration (cron expression)',
                    example: '0 9 * * 1',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _filters_decorators, { kind: "field", name: "filters", static: false, private: false, access: { has: function (obj) { return "filters" in obj; }, get: function (obj) { return obj.filters; }, set: function (obj, value) { obj.filters = value; } }, metadata: _metadata }, _filters_initializers, _filters_extraInitializers);
            __esDecorate(null, null, _sorting_decorators, { kind: "field", name: "sorting", static: false, private: false, access: { has: function (obj) { return "sorting" in obj; }, get: function (obj) { return obj.sorting; }, set: function (obj, value) { obj.sorting = value; } }, metadata: _metadata }, _sorting_initializers, _sorting_extraInitializers);
            __esDecorate(null, null, _columns_decorators, { kind: "field", name: "columns", static: false, private: false, access: { has: function (obj) { return "columns" in obj; }, get: function (obj) { return obj.columns; }, set: function (obj, value) { obj.columns = value; } }, metadata: _metadata }, _columns_initializers, _columns_extraInitializers);
            __esDecorate(null, null, _isPublic_decorators, { kind: "field", name: "isPublic", static: false, private: false, access: { has: function (obj) { return "isPublic" in obj; }, get: function (obj) { return obj.isPublic; }, set: function (obj, value) { obj.isPublic = value; } }, metadata: _metadata }, _isPublic_initializers, _isPublic_extraInitializers);
            __esDecorate(null, null, _scheduleConfig_decorators, { kind: "field", name: "scheduleConfig", static: false, private: false, access: { has: function (obj) { return "scheduleConfig" in obj; }, get: function (obj) { return obj.scheduleConfig; }, set: function (obj, value) { obj.scheduleConfig = value; } }, metadata: _metadata }, _scheduleConfig_initializers, _scheduleConfig_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateReportDto = CreateReportDto;
