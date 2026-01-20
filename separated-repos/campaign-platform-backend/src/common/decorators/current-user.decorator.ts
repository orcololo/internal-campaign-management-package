import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { MockUser } from '../mock-auth.service';

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
export const CurrentUser = createParamDecorator(
  (data: keyof MockUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
