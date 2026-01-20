import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MockAuthService } from '../mock-auth.service';
import type { UserRole } from '../../database/schemas/user.schema';

/**
 * Roles Decorator Metadata Key
 */
export const ROLES_KEY = 'roles';

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
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

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
@Injectable()
export class MockAuthGuard implements CanActivate {
  constructor(
    private mockAuthService: MockAuthService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Inject mock user into request
    request.user = this.mockAuthService.getMockUser();

    // Check role-based access control
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles specified, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Check if user has required role
    return this.mockAuthService.hasRole(request.user, requiredRoles);
  }
}

/**
 * Mock Roles Guard (Optional - if you want separate guards)
 *
 * Use with MockAuthGuard for explicit role checking
 */
@Injectable()
export class MockRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private mockAuthService: MockAuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return this.mockAuthService.hasRole(user, requiredRoles);
  }
}
