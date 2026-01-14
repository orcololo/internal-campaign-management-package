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
exports.MockRolesGuard = exports.MockAuthGuard = exports.Roles = exports.ROLES_KEY = void 0;
var common_1 = require("@nestjs/common");
/**
 * Roles Decorator Metadata Key
 */
exports.ROLES_KEY = 'roles';
/**
 * Roles Decorator
 *
 * Use to specify which roles can access an endpoint
 *
 * @example
 * ```typescript
 * @Get()
 * @Roles('CANDIDATO', 'ESTRATEGISTA')
 * async findAll() { }
 * ```
 */
var Roles = function () {
    var roles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        roles[_i] = arguments[_i];
    }
    return (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
};
exports.Roles = Roles;
/**
 * Mock Authentication Guard
 *
 * Simulates authentication by injecting a mock user into the request.
 * This guard allows development without Keycloak setup.
 *
 * Features:
 * - Injects mock user into request.user
 * - Supports role-based access control via @Roles() decorator
 * - Easy to swap with JwtAuthGuard later
 *
 * Usage:
 * ```typescript
 * @Controller('reports')
 * @UseGuards(MockAuthGuard)
 * export class ReportsController {
 *   @Get()
 *   @Roles('CANDIDATO', 'ESTRATEGISTA')
 *   async findAll(@CurrentUser() user: MockUser) {
 *     // user is automatically injected
 *   }
 * }
 * ```
 *
 * Migration to Real Auth:
 * Simply replace MockAuthGuard with JwtAuthGuard:
 * ```typescript
 * @UseGuards(JwtAuthGuard, RolesGuard)  // Phase 10
 * ```
 */
var MockAuthGuard = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MockAuthGuard = _classThis = /** @class */ (function () {
        function MockAuthGuard_1(mockAuthService, reflector) {
            this.mockAuthService = mockAuthService;
            this.reflector = reflector;
        }
        MockAuthGuard_1.prototype.canActivate = function (context) {
            var request = context.switchToHttp().getRequest();
            // Inject mock user into request
            request.user = this.mockAuthService.getMockUser();
            // Check role-based access control
            var requiredRoles = this.reflector.getAllAndOverride(exports.ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);
            // If no roles specified, allow access
            if (!requiredRoles || requiredRoles.length === 0) {
                return true;
            }
            // Check if user has required role
            return this.mockAuthService.hasRole(request.user, requiredRoles);
        };
        return MockAuthGuard_1;
    }());
    __setFunctionName(_classThis, "MockAuthGuard");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MockAuthGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MockAuthGuard = _classThis;
}();
exports.MockAuthGuard = MockAuthGuard;
/**
 * Mock Roles Guard (Optional - if you want separate guards)
 *
 * Use with MockAuthGuard for explicit role checking
 */
var MockRolesGuard = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MockRolesGuard = _classThis = /** @class */ (function () {
        function MockRolesGuard_1(reflector, mockAuthService) {
            this.reflector = reflector;
            this.mockAuthService = mockAuthService;
        }
        MockRolesGuard_1.prototype.canActivate = function (context) {
            var requiredRoles = this.reflector.getAllAndOverride(exports.ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);
            if (!requiredRoles) {
                return true;
            }
            var request = context.switchToHttp().getRequest();
            var user = request.user;
            return this.mockAuthService.hasRole(user, requiredRoles);
        };
        return MockRolesGuard_1;
    }());
    __setFunctionName(_classThis, "MockRolesGuard");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MockRolesGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MockRolesGuard = _classThis;
}();
exports.MockRolesGuard = MockRolesGuard;
