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
exports.QueryReferralsDto = exports.ReferralCodeDto = exports.ReferralStatsDto = exports.CreateReferralDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
/**
 * DTO for registering a new voter via referral code
 *
 * Used when someone clicks on a referral link and signs up
 */
var CreateReferralDto = function () {
    var _a;
    var _referralCode_decorators;
    var _referralCode_initializers = [];
    var _referralCode_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _whatsapp_decorators;
    var _whatsapp_initializers = [];
    var _whatsapp_extraInitializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _city_extraInitializers = [];
    var _state_decorators;
    var _state_initializers = [];
    var _state_extraInitializers = [];
    var _supportLevel_decorators;
    var _supportLevel_initializers = [];
    var _supportLevel_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateReferralDto() {
                this.referralCode = __runInitializers(this, _referralCode_initializers, void 0);
                this.name = (__runInitializers(this, _referralCode_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.email = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.whatsapp = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _whatsapp_initializers, void 0));
                this.city = (__runInitializers(this, _whatsapp_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                this.state = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _state_initializers, void 0));
                this.supportLevel = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _supportLevel_initializers, void 0));
                __runInitializers(this, _supportLevel_extraInitializers);
            }
            return CreateReferralDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _referralCode_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Referral code from the referring voter',
                    example: 'JOAO-SILVA-AB12CD',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(5), (0, class_validator_1.MaxLength)(50)];
            _name_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Full name of the new voter',
                    example: 'Maria Santos',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _email_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Email address',
                    example: 'maria.santos@example.com',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEmail)()];
            _phone_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Phone number',
                    example: '(11) 98765-4321',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(20)];
            _whatsapp_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'WhatsApp number',
                    example: '(11) 98765-4321',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(20)];
            _city_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'City',
                    example: 'São Paulo',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(100)];
            _state_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'State (2-letter code)',
                    example: 'SP',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2)];
            _supportLevel_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Support level for the campaign',
                    enum: [
                        'MUITO_FAVORAVEL',
                        'FAVORAVEL',
                        'NEUTRO',
                        'DESFAVORAVEL',
                        'MUITO_DESFAVORAVEL',
                        'NAO_DEFINIDO',
                    ],
                    example: 'FAVORAVEL',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)([
                    'MUITO_FAVORAVEL',
                    'FAVORAVEL',
                    'NEUTRO',
                    'DESFAVORAVEL',
                    'MUITO_DESFAVORAVEL',
                    'NAO_DEFINIDO',
                ])];
            __esDecorate(null, null, _referralCode_decorators, { kind: "field", name: "referralCode", static: false, private: false, access: { has: function (obj) { return "referralCode" in obj; }, get: function (obj) { return obj.referralCode; }, set: function (obj, value) { obj.referralCode = value; } }, metadata: _metadata }, _referralCode_initializers, _referralCode_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _whatsapp_decorators, { kind: "field", name: "whatsapp", static: false, private: false, access: { has: function (obj) { return "whatsapp" in obj; }, get: function (obj) { return obj.whatsapp; }, set: function (obj, value) { obj.whatsapp = value; } }, metadata: _metadata }, _whatsapp_initializers, _whatsapp_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: function (obj) { return "state" in obj; }, get: function (obj) { return obj.state; }, set: function (obj, value) { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
            __esDecorate(null, null, _supportLevel_decorators, { kind: "field", name: "supportLevel", static: false, private: false, access: { has: function (obj) { return "supportLevel" in obj; }, get: function (obj) { return obj.supportLevel; }, set: function (obj, value) { obj.supportLevel = value; } }, metadata: _metadata }, _supportLevel_initializers, _supportLevel_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateReferralDto = CreateReferralDto;
/**
 * Referral statistics response DTO
 *
 * Returned when querying /voters/:id/referral-stats
 */
var ReferralStatsDto = function () {
    var _a;
    var _total_decorators;
    var _total_initializers = [];
    var _total_extraInitializers = [];
    var _active_decorators;
    var _active_initializers = [];
    var _active_extraInitializers = [];
    var _thisMonth_decorators;
    var _thisMonth_initializers = [];
    var _thisMonth_extraInitializers = [];
    var _byLevel_decorators;
    var _byLevel_initializers = [];
    var _byLevel_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ReferralStatsDto() {
                this.total = __runInitializers(this, _total_initializers, void 0);
                this.active = (__runInitializers(this, _total_extraInitializers), __runInitializers(this, _active_initializers, void 0));
                this.thisMonth = (__runInitializers(this, _active_extraInitializers), __runInitializers(this, _thisMonth_initializers, void 0));
                this.byLevel = (__runInitializers(this, _thisMonth_extraInitializers), __runInitializers(this, _byLevel_initializers, void 0));
                __runInitializers(this, _byLevel_extraInitializers);
            }
            return ReferralStatsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _total_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Total number of referred voters',
                    example: 15,
                })];
            _active_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Number of active (non-deleted) referred voters',
                    example: 14,
                })];
            _thisMonth_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Number of referrals this month',
                    example: 3,
                })];
            _byLevel_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Breakdown of referred voters by support level',
                    example: {
                        MUITO_FAVORAVEL: 5,
                        FAVORAVEL: 8,
                        NEUTRO: 1,
                        NAO_DEFINIDO: 1,
                    },
                })];
            __esDecorate(null, null, _total_decorators, { kind: "field", name: "total", static: false, private: false, access: { has: function (obj) { return "total" in obj; }, get: function (obj) { return obj.total; }, set: function (obj, value) { obj.total = value; } }, metadata: _metadata }, _total_initializers, _total_extraInitializers);
            __esDecorate(null, null, _active_decorators, { kind: "field", name: "active", static: false, private: false, access: { has: function (obj) { return "active" in obj; }, get: function (obj) { return obj.active; }, set: function (obj, value) { obj.active = value; } }, metadata: _metadata }, _active_initializers, _active_extraInitializers);
            __esDecorate(null, null, _thisMonth_decorators, { kind: "field", name: "thisMonth", static: false, private: false, access: { has: function (obj) { return "thisMonth" in obj; }, get: function (obj) { return obj.thisMonth; }, set: function (obj, value) { obj.thisMonth = value; } }, metadata: _metadata }, _thisMonth_initializers, _thisMonth_extraInitializers);
            __esDecorate(null, null, _byLevel_decorators, { kind: "field", name: "byLevel", static: false, private: false, access: { has: function (obj) { return "byLevel" in obj; }, get: function (obj) { return obj.byLevel; }, set: function (obj, value) { obj.byLevel = value; } }, metadata: _metadata }, _byLevel_initializers, _byLevel_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ReferralStatsDto = ReferralStatsDto;
/**
 * Referral code response DTO
 */
var ReferralCodeDto = function () {
    var _a;
    var _referralCode_decorators;
    var _referralCode_initializers = [];
    var _referralCode_extraInitializers = [];
    var _referralUrl_decorators;
    var _referralUrl_initializers = [];
    var _referralUrl_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ReferralCodeDto() {
                this.referralCode = __runInitializers(this, _referralCode_initializers, void 0);
                this.referralUrl = (__runInitializers(this, _referralCode_extraInitializers), __runInitializers(this, _referralUrl_initializers, void 0));
                __runInitializers(this, _referralUrl_extraInitializers);
            }
            return ReferralCodeDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _referralCode_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Unique referral code',
                    example: 'JOAO-SILVA-AB12CD',
                })];
            _referralUrl_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Full referral URL',
                    example: 'https://app.eleicoes.com/cadastro?ref=JOAO-SILVA-AB12CD',
                })];
            __esDecorate(null, null, _referralCode_decorators, { kind: "field", name: "referralCode", static: false, private: false, access: { has: function (obj) { return "referralCode" in obj; }, get: function (obj) { return obj.referralCode; }, set: function (obj, value) { obj.referralCode = value; } }, metadata: _metadata }, _referralCode_initializers, _referralCode_extraInitializers);
            __esDecorate(null, null, _referralUrl_decorators, { kind: "field", name: "referralUrl", static: false, private: false, access: { has: function (obj) { return "referralUrl" in obj; }, get: function (obj) { return obj.referralUrl; }, set: function (obj, value) { obj.referralUrl = value; } }, metadata: _metadata }, _referralUrl_initializers, _referralUrl_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ReferralCodeDto = ReferralCodeDto;
/**
 * Query DTO for referrals list
 */
var QueryReferralsDto = function () {
    var _a;
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _perPage_decorators;
    var _perPage_initializers = [];
    var _perPage_extraInitializers = [];
    var _supportLevel_decorators;
    var _supportLevel_initializers = [];
    var _supportLevel_extraInitializers = [];
    return _a = /** @class */ (function () {
            function QueryReferralsDto() {
                this.page = __runInitializers(this, _page_initializers, 1);
                this.perPage = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _perPage_initializers, 20));
                this.supportLevel = (__runInitializers(this, _perPage_extraInitializers), __runInitializers(this, _supportLevel_initializers, void 0));
                __runInitializers(this, _supportLevel_extraInitializers);
            }
            return QueryReferralsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _page_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Page number for pagination',
                    example: 1,
                    default: 1,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _perPage_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Number of results per page',
                    example: 20,
                    default: 20,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(100)];
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
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _perPage_decorators, { kind: "field", name: "perPage", static: false, private: false, access: { has: function (obj) { return "perPage" in obj; }, get: function (obj) { return obj.perPage; }, set: function (obj, value) { obj.perPage = value; } }, metadata: _metadata }, _perPage_initializers, _perPage_extraInitializers);
            __esDecorate(null, null, _supportLevel_decorators, { kind: "field", name: "supportLevel", static: false, private: false, access: { has: function (obj) { return "supportLevel" in obj; }, get: function (obj) { return obj.supportLevel; }, set: function (obj, value) { obj.supportLevel = value; } }, metadata: _metadata }, _supportLevel_initializers, _supportLevel_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.QueryReferralsDto = QueryReferralsDto;
