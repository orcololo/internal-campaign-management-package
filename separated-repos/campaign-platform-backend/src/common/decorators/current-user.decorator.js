"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
var common_1 = require("@nestjs/common");
/**
 * Current User Decorator
 *
 * Extracts the authenticated user from the request object.
 * Works with both MockAuthGuard (development) and JwtAuthGuard (production).
 *
 * @example
 * ```typescript
 * @Get()
 * async findAll(@CurrentUser() user: MockUser) {
 *   console.log(user.email); // candidato@example.com
 *   console.log(user.role);  // CANDIDATO
 * }
 * ```
 *
 * Extract specific property:
 * ```typescript
 * @Get()
 * async findAll(@CurrentUser('id') userId: string) {
 *   console.log(userId); // mock-user-123
 * }
 * ```
 */
exports.CurrentUser = (0, common_1.createParamDecorator)(function (data, ctx) {
    var request = ctx.switchToHttp().getRequest();
    var user = request.user;
    return data ? user === null || user === void 0 ? void 0 : user[data] : user;
});
