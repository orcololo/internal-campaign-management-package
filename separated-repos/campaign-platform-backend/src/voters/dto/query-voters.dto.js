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
exports.QueryVotersDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var QueryVotersDto = function () {
    var _a;
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    var _sortBy_decorators;
    var _sortBy_initializers = [];
    var _sortBy_extraInitializers = [];
    var _sortOrder_decorators;
    var _sortOrder_initializers = [];
    var _sortOrder_extraInitializers = [];
    var _search_decorators;
    var _search_initializers = [];
    var _search_extraInitializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _city_extraInitializers = [];
    var _state_decorators;
    var _state_initializers = [];
    var _state_extraInitializers = [];
    var _neighborhood_decorators;
    var _neighborhood_initializers = [];
    var _neighborhood_extraInitializers = [];
    var _electoralZone_decorators;
    var _electoralZone_initializers = [];
    var _electoralZone_extraInitializers = [];
    var _electoralSection_decorators;
    var _electoralSection_initializers = [];
    var _electoralSection_extraInitializers = [];
    var _gender_decorators;
    var _gender_initializers = [];
    var _gender_extraInitializers = [];
    var _educationLevel_decorators;
    var _educationLevel_initializers = [];
    var _educationLevel_extraInitializers = [];
    var _incomeLevel_decorators;
    var _incomeLevel_initializers = [];
    var _incomeLevel_extraInitializers = [];
    var _maritalStatus_decorators;
    var _maritalStatus_initializers = [];
    var _maritalStatus_extraInitializers = [];
    var _supportLevel_decorators;
    var _supportLevel_initializers = [];
    var _supportLevel_extraInitializers = [];
    var _occupation_decorators;
    var _occupation_initializers = [];
    var _occupation_extraInitializers = [];
    var _religion_decorators;
    var _religion_initializers = [];
    var _religion_extraInitializers = [];
    var _hasWhatsapp_decorators;
    var _hasWhatsapp_initializers = [];
    var _hasWhatsapp_extraInitializers = [];
    return _a = /** @class */ (function () {
            function QueryVotersDto() {
                // Pagination
                this.page = __runInitializers(this, _page_initializers, 1);
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, 10));
                // Sorting
                this.sortBy = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _sortBy_initializers, void 0));
                this.sortOrder = (__runInitializers(this, _sortBy_extraInitializers), __runInitializers(this, _sortOrder_initializers, void 0));
                // Search
                this.search = (__runInitializers(this, _sortOrder_extraInitializers), __runInitializers(this, _search_initializers, void 0));
                // Location filters
                this.city = (__runInitializers(this, _search_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                this.state = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _state_initializers, void 0));
                this.neighborhood = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _neighborhood_initializers, void 0));
                // Electoral filters
                this.electoralZone = (__runInitializers(this, _neighborhood_extraInitializers), __runInitializers(this, _electoralZone_initializers, void 0));
                this.electoralSection = (__runInitializers(this, _electoralZone_extraInitializers), __runInitializers(this, _electoralSection_initializers, void 0));
                // Demographic filters
                this.gender = (__runInitializers(this, _electoralSection_extraInitializers), __runInitializers(this, _gender_initializers, void 0));
                this.educationLevel = (__runInitializers(this, _gender_extraInitializers), __runInitializers(this, _educationLevel_initializers, void 0));
                this.incomeLevel = (__runInitializers(this, _educationLevel_extraInitializers), __runInitializers(this, _incomeLevel_initializers, void 0));
                this.maritalStatus = (__runInitializers(this, _incomeLevel_extraInitializers), __runInitializers(this, _maritalStatus_initializers, void 0));
                // Political filters
                this.supportLevel = (__runInitializers(this, _maritalStatus_extraInitializers), __runInitializers(this, _supportLevel_initializers, void 0));
                this.occupation = (__runInitializers(this, _supportLevel_extraInitializers), __runInitializers(this, _occupation_initializers, void 0));
                this.religion = (__runInitializers(this, _occupation_extraInitializers), __runInitializers(this, _religion_initializers, void 0));
                // Contact filters
                this.hasWhatsapp = (__runInitializers(this, _religion_extraInitializers), __runInitializers(this, _hasWhatsapp_initializers, void 0));
                __runInitializers(this, _hasWhatsapp_extraInitializers);
            }
            return QueryVotersDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _page_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Page number', example: 1, default: 1 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _limit_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', example: 10, default: 10 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(1000)];
            _sortBy_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Sort by field',
                    example: 'createdAt',
                    enum: ['name', 'email', 'city', 'state', 'supportLevel', 'createdAt', 'updatedAt'],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sortOrder_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Sort order',
                    example: 'desc',
                    enum: ['asc', 'desc'],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['asc', 'desc'])];
            _search_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Search by name or CPF', example: 'João' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _city_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filter by city', example: 'São Paulo' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _state_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filter by state', example: 'SP' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _neighborhood_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filter by neighborhood', example: 'Centro' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _electoralZone_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filter by electoral zone', example: '001' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _electoralSection_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filter by electoral section', example: '0123' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _gender_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Filter by gender',
                    enum: ['MASCULINO', 'FEMININO', 'OUTRO', 'NAO_INFORMADO'],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['MASCULINO', 'FEMININO', 'OUTRO', 'NAO_INFORMADO'])];
            _educationLevel_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Filter by education level',
                    enum: [
                        'FUNDAMENTAL_INCOMPLETO',
                        'FUNDAMENTAL_COMPLETO',
                        'MEDIO_INCOMPLETO',
                        'MEDIO_COMPLETO',
                        'SUPERIOR_INCOMPLETO',
                        'SUPERIOR_COMPLETO',
                        'POS_GRADUACAO',
                        'NAO_INFORMADO',
                    ],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)([
                    'FUNDAMENTAL_INCOMPLETO',
                    'FUNDAMENTAL_COMPLETO',
                    'MEDIO_INCOMPLETO',
                    'MEDIO_COMPLETO',
                    'SUPERIOR_INCOMPLETO',
                    'SUPERIOR_COMPLETO',
                    'POS_GRADUACAO',
                    'NAO_INFORMADO',
                ])];
            _incomeLevel_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Filter by income level',
                    enum: [
                        'ATE_1_SALARIO',
                        'DE_1_A_2_SALARIOS',
                        'DE_2_A_5_SALARIOS',
                        'DE_5_A_10_SALARIOS',
                        'ACIMA_10_SALARIOS',
                        'NAO_INFORMADO',
                    ],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)([
                    'ATE_1_SALARIO',
                    'DE_1_A_2_SALARIOS',
                    'DE_2_A_5_SALARIOS',
                    'DE_5_A_10_SALARIOS',
                    'ACIMA_10_SALARIOS',
                    'NAO_INFORMADO',
                ])];
            _maritalStatus_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Filter by marital status',
                    enum: ['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'UNIAO_ESTAVEL', 'NAO_INFORMADO'],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'UNIAO_ESTAVEL', 'NAO_INFORMADO'])];
            _supportLevel_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Filter by support level',
                    enum: [
                        'MUITO_FAVORAVEL',
                        'FAVORAVEL',
                        'NEUTRO',
                        'DESFAVORAVEL',
                        'MUITO_DESFAVORAVEL',
                        'NAO_DEFINIDO',
                    ],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)([
                    'MUITO_FAVORAVEL',
                    'FAVORAVEL',
                    'NEUTRO',
                    'DESFAVORAVEL',
                    'MUITO_DESFAVORAVEL',
                    'NAO_DEFINIDO',
                ])];
            _occupation_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filter by occupation', example: 'Professor' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _religion_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filter by religion', example: 'Católica' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _hasWhatsapp_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Filter by WhatsApp availability',
                    enum: ['SIM', 'NAO'],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['SIM', 'NAO'])];
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _sortBy_decorators, { kind: "field", name: "sortBy", static: false, private: false, access: { has: function (obj) { return "sortBy" in obj; }, get: function (obj) { return obj.sortBy; }, set: function (obj, value) { obj.sortBy = value; } }, metadata: _metadata }, _sortBy_initializers, _sortBy_extraInitializers);
            __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: function (obj) { return "sortOrder" in obj; }, get: function (obj) { return obj.sortOrder; }, set: function (obj, value) { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: function (obj) { return "state" in obj; }, get: function (obj) { return obj.state; }, set: function (obj, value) { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
            __esDecorate(null, null, _neighborhood_decorators, { kind: "field", name: "neighborhood", static: false, private: false, access: { has: function (obj) { return "neighborhood" in obj; }, get: function (obj) { return obj.neighborhood; }, set: function (obj, value) { obj.neighborhood = value; } }, metadata: _metadata }, _neighborhood_initializers, _neighborhood_extraInitializers);
            __esDecorate(null, null, _electoralZone_decorators, { kind: "field", name: "electoralZone", static: false, private: false, access: { has: function (obj) { return "electoralZone" in obj; }, get: function (obj) { return obj.electoralZone; }, set: function (obj, value) { obj.electoralZone = value; } }, metadata: _metadata }, _electoralZone_initializers, _electoralZone_extraInitializers);
            __esDecorate(null, null, _electoralSection_decorators, { kind: "field", name: "electoralSection", static: false, private: false, access: { has: function (obj) { return "electoralSection" in obj; }, get: function (obj) { return obj.electoralSection; }, set: function (obj, value) { obj.electoralSection = value; } }, metadata: _metadata }, _electoralSection_initializers, _electoralSection_extraInitializers);
            __esDecorate(null, null, _gender_decorators, { kind: "field", name: "gender", static: false, private: false, access: { has: function (obj) { return "gender" in obj; }, get: function (obj) { return obj.gender; }, set: function (obj, value) { obj.gender = value; } }, metadata: _metadata }, _gender_initializers, _gender_extraInitializers);
            __esDecorate(null, null, _educationLevel_decorators, { kind: "field", name: "educationLevel", static: false, private: false, access: { has: function (obj) { return "educationLevel" in obj; }, get: function (obj) { return obj.educationLevel; }, set: function (obj, value) { obj.educationLevel = value; } }, metadata: _metadata }, _educationLevel_initializers, _educationLevel_extraInitializers);
            __esDecorate(null, null, _incomeLevel_decorators, { kind: "field", name: "incomeLevel", static: false, private: false, access: { has: function (obj) { return "incomeLevel" in obj; }, get: function (obj) { return obj.incomeLevel; }, set: function (obj, value) { obj.incomeLevel = value; } }, metadata: _metadata }, _incomeLevel_initializers, _incomeLevel_extraInitializers);
            __esDecorate(null, null, _maritalStatus_decorators, { kind: "field", name: "maritalStatus", static: false, private: false, access: { has: function (obj) { return "maritalStatus" in obj; }, get: function (obj) { return obj.maritalStatus; }, set: function (obj, value) { obj.maritalStatus = value; } }, metadata: _metadata }, _maritalStatus_initializers, _maritalStatus_extraInitializers);
            __esDecorate(null, null, _supportLevel_decorators, { kind: "field", name: "supportLevel", static: false, private: false, access: { has: function (obj) { return "supportLevel" in obj; }, get: function (obj) { return obj.supportLevel; }, set: function (obj, value) { obj.supportLevel = value; } }, metadata: _metadata }, _supportLevel_initializers, _supportLevel_extraInitializers);
            __esDecorate(null, null, _occupation_decorators, { kind: "field", name: "occupation", static: false, private: false, access: { has: function (obj) { return "occupation" in obj; }, get: function (obj) { return obj.occupation; }, set: function (obj, value) { obj.occupation = value; } }, metadata: _metadata }, _occupation_initializers, _occupation_extraInitializers);
            __esDecorate(null, null, _religion_decorators, { kind: "field", name: "religion", static: false, private: false, access: { has: function (obj) { return "religion" in obj; }, get: function (obj) { return obj.religion; }, set: function (obj, value) { obj.religion = value; } }, metadata: _metadata }, _religion_initializers, _religion_extraInitializers);
            __esDecorate(null, null, _hasWhatsapp_decorators, { kind: "field", name: "hasWhatsapp", static: false, private: false, access: { has: function (obj) { return "hasWhatsapp" in obj; }, get: function (obj) { return obj.hasWhatsapp; }, set: function (obj, value) { obj.hasWhatsapp = value; } }, metadata: _metadata }, _hasWhatsapp_initializers, _hasWhatsapp_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.QueryVotersDto = QueryVotersDto;
