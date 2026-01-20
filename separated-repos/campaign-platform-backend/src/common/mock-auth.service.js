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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockAuthService = void 0;
var common_1 = require("@nestjs/common");
/**
 * Mock Authentication Service
 *
 * Provides hardcoded user data for development and testing.
 * This service will be replaced with real Keycloak authentication
 * in Phase 10 (Weeks 13-14).
 *
 * Usage:
 * - Use MockAuthGuard on controllers during development
 * - Switch to JwtAuthGuard when implementing real auth
 * - All business logic remains unchanged
 *
 * @example
 * ```typescript
 * // In controller
 * @UseGuards(MockAuthGuard)  // Development
 * @UseGuards(JwtAuthGuard)   // Production (later)
 * ```
 */
var MockAuthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MockAuthService = _classThis = /** @class */ (function () {
        function MockAuthService_1() {
        }
        /**
         * Get default mock user (CANDIDATO role)
         *
         * This user has full access to all features.
         * Use for development and testing.
         */
        MockAuthService_1.prototype.getMockUser = function () {
            return {
                id: '550e8400-e29b-41d4-a716-446655440000', // Valid UUID format
                email: 'candidato@example.com',
                name: 'João Silva',
                role: 'CANDIDATO',
                tenantId: '650e8400-e29b-41d4-a716-446655440000', // Valid UUID format
                keycloakId: '750e8400-e29b-41d4-a716-446655440000', // Valid UUID format
            };
        };
        /**
         * Get mock user with specific role
         *
         * Useful for testing role-based access control
         */
        MockAuthService_1.prototype.getMockUserWithRole = function (role) {
            var roleEmails = {
                CANDIDATO: 'candidato@example.com',
                ESTRATEGISTA: 'estrategista@example.com',
                LIDERANCA: 'lideranca@example.com',
                ESCRITORIO: 'escritorio@example.com',
            };
            var roleNames = {
                CANDIDATO: 'João Silva (Candidato)',
                ESTRATEGISTA: 'Maria Santos (Estrategista)',
                LIDERANCA: 'Pedro Oliveira (Liderança)',
                ESCRITORIO: 'Ana Costa (Escritório)',
            };
            var roleUUIDs = {
                CANDIDATO: '550e8400-e29b-41d4-a716-446655440000',
                ESTRATEGISTA: '550e8400-e29b-41d4-a716-446655440001',
                LIDERANCA: '550e8400-e29b-41d4-a716-446655440002',
                ESCRITORIO: '550e8400-e29b-41d4-a716-446655440003',
            };
            return {
                id: roleUUIDs[role],
                email: roleEmails[role],
                name: roleNames[role],
                role: role,
                tenantId: '650e8400-e29b-41d4-a716-446655440000',
                keycloakId: "750e8400-e29b-41d4-a716-446655440".concat(Object.keys(roleUUIDs).indexOf(role)),
            };
        };
        /**
         * Get mock tenant ID
         *
         * For multi-tenancy testing
         */
        MockAuthService_1.prototype.getMockTenantId = function () {
            return '650e8400-e29b-41d4-a716-446655440000';
        };
        /**
         * Validate if user has required role
         *
         * Simulates RBAC logic
         */
        MockAuthService_1.prototype.hasRole = function (user, allowedRoles) {
            return allowedRoles.includes(user.role);
        };
        /**
         * Get multiple mock users for testing
         *
         * Returns users with different roles
         */
        MockAuthService_1.prototype.getAllMockUsers = function () {
            var _this = this;
            var roles = ['CANDIDATO', 'ESTRATEGISTA', 'LIDERANCA', 'ESCRITORIO'];
            return roles.map(function (role) { return _this.getMockUserWithRole(role); });
        };
        return MockAuthService_1;
    }());
    __setFunctionName(_classThis, "MockAuthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MockAuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MockAuthService = _classThis;
}();
exports.MockAuthService = MockAuthService;
