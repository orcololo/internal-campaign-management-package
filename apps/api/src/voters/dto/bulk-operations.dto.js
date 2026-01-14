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
exports.BulkUpdateDto = exports.BulkUpdateItemDto = exports.BulkDeleteDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var update_voter_dto_1 = require("./update-voter.dto");
var BulkDeleteDto = function () {
    var _a;
    var _ids_decorators;
    var _ids_initializers = [];
    var _ids_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BulkDeleteDto() {
                this.ids = __runInitializers(this, _ids_initializers, void 0);
                __runInitializers(this, _ids_extraInitializers);
            }
            return BulkDeleteDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _ids_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Array of voter IDs to delete',
                    example: ['uuid-1', 'uuid-2', 'uuid-3'],
                    type: [String],
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ArrayMinSize)(1), (0, class_validator_1.IsUUID)('4', { each: true })];
            __esDecorate(null, null, _ids_decorators, { kind: "field", name: "ids", static: false, private: false, access: { has: function (obj) { return "ids" in obj; }, get: function (obj) { return obj.ids; }, set: function (obj, value) { obj.ids = value; } }, metadata: _metadata }, _ids_initializers, _ids_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BulkDeleteDto = BulkDeleteDto;
var BulkUpdateItemDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _data_decorators;
    var _data_initializers = [];
    var _data_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BulkUpdateItemDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.data = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _data_initializers, void 0));
                __runInitializers(this, _data_extraInitializers);
            }
            return BulkUpdateItemDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Voter ID',
                    example: 'uuid-1',
                }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsUUID)('4')];
            _data_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Voter data to update',
                    type: function () { return update_voter_dto_1.UpdateVoterDto; },
                }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(function () { return update_voter_dto_1.UpdateVoterDto; })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: function (obj) { return "data" in obj; }, get: function (obj) { return obj.data; }, set: function (obj, value) { obj.data = value; } }, metadata: _metadata }, _data_initializers, _data_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BulkUpdateItemDto = BulkUpdateItemDto;
var BulkUpdateDto = function () {
    var _a;
    var _updates_decorators;
    var _updates_initializers = [];
    var _updates_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BulkUpdateDto() {
                this.updates = __runInitializers(this, _updates_initializers, void 0);
                __runInitializers(this, _updates_extraInitializers);
            }
            return BulkUpdateDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _updates_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Array of voter updates',
                    type: [BulkUpdateItemDto],
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ArrayMinSize)(1), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return BulkUpdateItemDto; })];
            __esDecorate(null, null, _updates_decorators, { kind: "field", name: "updates", static: false, private: false, access: { has: function (obj) { return "updates" in obj; }, get: function (obj) { return obj.updates; }, set: function (obj, value) { obj.updates = value; } }, metadata: _metadata }, _updates_initializers, _updates_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BulkUpdateDto = BulkUpdateDto;
