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
exports.ExportReportDto = exports.ExportFormat = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var ExportFormat;
(function (ExportFormat) {
    ExportFormat["PDF"] = "pdf";
    ExportFormat["CSV"] = "csv";
    ExportFormat["EXCEL"] = "excel";
})(ExportFormat || (exports.ExportFormat = ExportFormat = {}));
var ExportReportDto = function () {
    var _a;
    var _format_decorators;
    var _format_initializers = [];
    var _format_extraInitializers = [];
    var _includeSummary_decorators;
    var _includeSummary_initializers = [];
    var _includeSummary_extraInitializers = [];
    var _includeFilters_decorators;
    var _includeFilters_initializers = [];
    var _includeFilters_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ExportReportDto() {
                this.format = __runInitializers(this, _format_initializers, void 0);
                this.includeSummary = (__runInitializers(this, _format_extraInitializers), __runInitializers(this, _includeSummary_initializers, true));
                this.includeFilters = (__runInitializers(this, _includeSummary_extraInitializers), __runInitializers(this, _includeFilters_initializers, true));
                __runInitializers(this, _includeFilters_extraInitializers);
            }
            return ExportReportDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _format_decorators = [(0, swagger_1.ApiProperty)({
                    enum: ExportFormat,
                    description: 'Export format',
                    example: ExportFormat.PDF,
                }), (0, class_validator_1.IsEnum)(ExportFormat)];
            _includeSummary_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Include summary statistics in export',
                    required: false,
                    default: true,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _includeFilters_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Include auto-filters in Excel export',
                    required: false,
                    default: true,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _format_decorators, { kind: "field", name: "format", static: false, private: false, access: { has: function (obj) { return "format" in obj; }, get: function (obj) { return obj.format; }, set: function (obj, value) { obj.format = value; } }, metadata: _metadata }, _format_initializers, _format_extraInitializers);
            __esDecorate(null, null, _includeSummary_decorators, { kind: "field", name: "includeSummary", static: false, private: false, access: { has: function (obj) { return "includeSummary" in obj; }, get: function (obj) { return obj.includeSummary; }, set: function (obj, value) { obj.includeSummary = value; } }, metadata: _metadata }, _includeSummary_initializers, _includeSummary_extraInitializers);
            __esDecorate(null, null, _includeFilters_decorators, { kind: "field", name: "includeFilters", static: false, private: false, access: { has: function (obj) { return "includeFilters" in obj; }, get: function (obj) { return obj.includeFilters; }, set: function (obj, value) { obj.includeFilters = value; } }, metadata: _metadata }, _includeFilters_initializers, _includeFilters_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ExportReportDto = ExportReportDto;
