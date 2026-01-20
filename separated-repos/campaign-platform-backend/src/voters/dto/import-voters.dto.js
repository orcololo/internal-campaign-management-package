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
exports.ImportVotersDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var ImportVotersDto = function () {
    var _a;
    var _file_decorators;
    var _file_initializers = [];
    var _file_extraInitializers = [];
    var _skipDuplicates_decorators;
    var _skipDuplicates_initializers = [];
    var _skipDuplicates_extraInitializers = [];
    var _autoGeocode_decorators;
    var _autoGeocode_initializers = [];
    var _autoGeocode_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ImportVotersDto() {
                this.file = __runInitializers(this, _file_initializers, void 0);
                this.skipDuplicates = (__runInitializers(this, _file_extraInitializers), __runInitializers(this, _skipDuplicates_initializers, true));
                this.autoGeocode = (__runInitializers(this, _skipDuplicates_extraInitializers), __runInitializers(this, _autoGeocode_initializers, false));
                __runInitializers(this, _autoGeocode_extraInitializers);
            }
            return ImportVotersDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _file_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'CSV file to import',
                    type: 'string',
                    format: 'binary',
                })];
            _skipDuplicates_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Skip duplicate entries (by CPF)',
                    example: true,
                    default: true,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _autoGeocode_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Auto-geocode addresses during import',
                    example: false,
                    default: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _file_decorators, { kind: "field", name: "file", static: false, private: false, access: { has: function (obj) { return "file" in obj; }, get: function (obj) { return obj.file; }, set: function (obj, value) { obj.file = value; } }, metadata: _metadata }, _file_initializers, _file_extraInitializers);
            __esDecorate(null, null, _skipDuplicates_decorators, { kind: "field", name: "skipDuplicates", static: false, private: false, access: { has: function (obj) { return "skipDuplicates" in obj; }, get: function (obj) { return obj.skipDuplicates; }, set: function (obj, value) { obj.skipDuplicates = value; } }, metadata: _metadata }, _skipDuplicates_initializers, _skipDuplicates_extraInitializers);
            __esDecorate(null, null, _autoGeocode_decorators, { kind: "field", name: "autoGeocode", static: false, private: false, access: { has: function (obj) { return "autoGeocode" in obj; }, get: function (obj) { return obj.autoGeocode; }, set: function (obj, value) { obj.autoGeocode = value; } }, metadata: _metadata }, _autoGeocode_initializers, _autoGeocode_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ImportVotersDto = ImportVotersDto;
