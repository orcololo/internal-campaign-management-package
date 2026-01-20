"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilderService = void 0;
var common_1 = require("@nestjs/common");
var drizzle_orm_1 = require("drizzle-orm");
var create_report_dto_1 = require("./dto/create-report.dto");
var voter_schema_1 = require("../database/schemas/voter.schema");
/**
 * QueryBuilder Service
 *
 * Converts filter and sort DTOs into Drizzle ORM queries.
 * Supports 15 filter operators for dynamic report generation.
 */
var QueryBuilderService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var QueryBuilderService = _classThis = /** @class */ (function () {
        function QueryBuilderService_1() {
        }
        /**
         * Build WHERE clause from filters
         */
        QueryBuilderService_1.prototype.buildWhereClause = function (filters) {
            var _this = this;
            if (!filters || filters.length === 0) {
                return undefined;
            }
            var conditions = filters
                .map(function (filter) { return _this.buildFilterCondition(filter); })
                .filter(function (condition) { return condition !== null; });
            if (conditions.length === 0) {
                return undefined;
            }
            // Combine all conditions with AND
            return drizzle_orm_1.and.apply(void 0, conditions);
        };
        /**
         * Build single filter condition based on operator
         */
        QueryBuilderService_1.prototype.buildFilterCondition = function (filter) {
            var column = this.getVoterColumn(filter.field);
            if (!column) {
                return null;
            }
            switch (filter.operator) {
                case create_report_dto_1.FilterOperator.EQUALS:
                    return (0, drizzle_orm_1.eq)(column, filter.value);
                case create_report_dto_1.FilterOperator.NOT_EQUALS:
                    return (0, drizzle_orm_1.ne)(column, filter.value);
                case create_report_dto_1.FilterOperator.CONTAINS:
                    return (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", " ILIKE ", ""], ["", " ILIKE ", ""])), column, "%".concat(filter.value, "%"));
                case create_report_dto_1.FilterOperator.NOT_CONTAINS:
                    return (0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["", " NOT ILIKE ", ""], ["", " NOT ILIKE ", ""])), column, "%".concat(filter.value, "%"));
                case create_report_dto_1.FilterOperator.STARTS_WITH:
                    return (0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["", " ILIKE ", ""], ["", " ILIKE ", ""])), column, "".concat(filter.value, "%"));
                case create_report_dto_1.FilterOperator.ENDS_WITH:
                    return (0, drizzle_orm_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["", " ILIKE ", ""], ["", " ILIKE ", ""])), column, "%".concat(filter.value));
                case create_report_dto_1.FilterOperator.IN:
                    if (!Array.isArray(filter.value)) {
                        return null;
                    }
                    return (0, drizzle_orm_1.inArray)(column, filter.value);
                case create_report_dto_1.FilterOperator.NOT_IN:
                    if (!Array.isArray(filter.value)) {
                        return null;
                    }
                    return (0, drizzle_orm_1.notInArray)(column, filter.value);
                case create_report_dto_1.FilterOperator.GREATER_THAN:
                    return (0, drizzle_orm_1.gt)(column, filter.value);
                case create_report_dto_1.FilterOperator.GREATER_THAN_OR_EQUAL:
                    return (0, drizzle_orm_1.gte)(column, filter.value);
                case create_report_dto_1.FilterOperator.LESS_THAN:
                    return (0, drizzle_orm_1.lt)(column, filter.value);
                case create_report_dto_1.FilterOperator.LESS_THAN_OR_EQUAL:
                    return (0, drizzle_orm_1.lte)(column, filter.value);
                case create_report_dto_1.FilterOperator.BETWEEN:
                    if (!Array.isArray(filter.value) || filter.value.length !== 2) {
                        return null;
                    }
                    return (0, drizzle_orm_1.between)(column, filter.value[0], filter.value[1]);
                case create_report_dto_1.FilterOperator.IS_NULL:
                    return (0, drizzle_orm_1.isNull)(column);
                case create_report_dto_1.FilterOperator.IS_NOT_NULL:
                    return (0, drizzle_orm_1.isNotNull)(column);
                default:
                    return null;
            }
        };
        /**
         * Build ORDER BY clause from sort rules
         */
        QueryBuilderService_1.prototype.buildOrderByClause = function (sortRules) {
            var _this = this;
            if (!sortRules || sortRules.length === 0) {
                return [];
            }
            return sortRules
                .map(function (sortRule) {
                var column = _this.getVoterColumn(sortRule.field);
                if (!column) {
                    return null;
                }
                if (sortRule.direction === create_report_dto_1.SortDirection.DESC) {
                    return (0, drizzle_orm_1.sql)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["", " DESC"], ["", " DESC"])), column);
                }
                else {
                    return (0, drizzle_orm_1.sql)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["", " ASC"], ["", " ASC"])), column);
                }
            })
                .filter(function (orderBy) { return orderBy !== null; });
        };
        /**
         * Build SELECT clause (column selection)
         */
        QueryBuilderService_1.prototype.buildSelectClause = function (columns) {
            var _this = this;
            if (!columns || columns.length === 0) {
                // Return all columns
                return undefined;
            }
            var selectObject = {};
            columns.forEach(function (columnName) {
                var column = _this.getVoterColumn(columnName);
                if (column) {
                    selectObject[columnName] = column;
                }
            });
            return Object.keys(selectObject).length > 0 ? selectObject : undefined;
        };
        /**
         * Get voter column by field name
         */
        QueryBuilderService_1.prototype.getVoterColumn = function (fieldName) {
            // Map field names to voter columns
            var columnMap = {
                // IDs
                id: voter_schema_1.voters.id,
                // Personal Info
                name: voter_schema_1.voters.name,
                cpf: voter_schema_1.voters.cpf,
                dateOfBirth: voter_schema_1.voters.dateOfBirth,
                email: voter_schema_1.voters.email,
                phone: voter_schema_1.voters.phone,
                whatsapp: voter_schema_1.voters.whatsapp,
                gender: voter_schema_1.voters.gender,
                occupation: voter_schema_1.voters.occupation,
                // Address
                zipCode: voter_schema_1.voters.zipCode,
                address: voter_schema_1.voters.address,
                addressNumber: voter_schema_1.voters.addressNumber,
                addressComplement: voter_schema_1.voters.addressComplement,
                neighborhood: voter_schema_1.voters.neighborhood,
                city: voter_schema_1.voters.city,
                state: voter_schema_1.voters.state,
                latitude: voter_schema_1.voters.latitude,
                longitude: voter_schema_1.voters.longitude,
                // Electoral
                electoralZone: voter_schema_1.voters.electoralZone,
                electoralSection: voter_schema_1.voters.electoralSection,
                electoralTitle: voter_schema_1.voters.electoralTitle,
                votingLocation: voter_schema_1.voters.votingLocation,
                // Social
                educationLevel: voter_schema_1.voters.educationLevel,
                incomeLevel: voter_schema_1.voters.incomeLevel,
                maritalStatus: voter_schema_1.voters.maritalStatus,
                religion: voter_schema_1.voters.religion,
                ethnicity: voter_schema_1.voters.ethnicity,
                // Campaign
                supportLevel: voter_schema_1.voters.supportLevel,
                politicalParty: voter_schema_1.voters.politicalParty,
                influencerScore: voter_schema_1.voters.influencerScore,
                persuadability: voter_schema_1.voters.persuadability,
                turnoutLikelihood: voter_schema_1.voters.turnoutLikelihood,
                // Social Media
                facebook: voter_schema_1.voters.facebook,
                instagram: voter_schema_1.voters.instagram,
                twitter: voter_schema_1.voters.twitter,
                // Engagement
                lastContactDate: voter_schema_1.voters.lastContactDate,
                engagementScore: voter_schema_1.voters.engagementScore,
                engagementTrend: voter_schema_1.voters.engagementTrend,
                communicationStyle: voter_schema_1.voters.communicationStyle,
                // Community
                communityRole: voter_schema_1.voters.communityRole,
                volunteerStatus: voter_schema_1.voters.volunteerStatus,
                // Referral
                referralCode: voter_schema_1.voters.referralCode,
                referredBy: voter_schema_1.voters.referredBy,
                referralDate: voter_schema_1.voters.referralDate,
                // Metadata
                tags: voter_schema_1.voters.tags,
                notes: voter_schema_1.voters.notes,
                deletedAt: voter_schema_1.voters.deletedAt,
                createdAt: voter_schema_1.voters.createdAt,
                updatedAt: voter_schema_1.voters.updatedAt,
            };
            return columnMap[fieldName] || null;
        };
        /**
         * Validate filter field exists
         */
        QueryBuilderService_1.prototype.isValidField = function (fieldName) {
            return this.getVoterColumn(fieldName) !== null;
        };
        /**
         * Get list of all available fields
         */
        QueryBuilderService_1.prototype.getAvailableFields = function () {
            return [
                'id',
                'name',
                'cpf',
                'dateOfBirth',
                'email',
                'phone',
                'whatsapp',
                'gender',
                'occupation',
                'zipCode',
                'address',
                'addressNumber',
                'addressComplement',
                'neighborhood',
                'city',
                'state',
                'latitude',
                'longitude',
                'electoralZone',
                'electoralSection',
                'electoralTitle',
                'votingLocation',
                'educationLevel',
                'incomeLevel',
                'maritalStatus',
                'religion',
                'ethnicity',
                'supportLevel',
                'politicalParty',
                'influencerScore',
                'persuadability',
                'turnoutLikelihood',
                'facebook',
                'instagram',
                'twitter',
                'lastContactDate',
                'engagementScore',
                'engagementTrend',
                'communicationStyle',
                'communityRole',
                'volunteerStatus',
                'referralCode',
                'referredBy',
                'referralDate',
                'tags',
                'notes',
                'createdAt',
                'updatedAt',
            ];
        };
        return QueryBuilderService_1;
    }());
    __setFunctionName(_classThis, "QueryBuilderService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        QueryBuilderService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return QueryBuilderService = _classThis;
}();
exports.QueryBuilderService = QueryBuilderService;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
