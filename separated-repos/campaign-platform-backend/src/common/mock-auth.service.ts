import { Injectable } from '@nestjs/common';
import type { UserRole, User } from '../types';

/**
 * Mock User Interface
 *
 * Simulates a logged-in user for development without Keycloak
 */
export interface MockUser extends User {
  tenantId: string;
}

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
@Injectable()
export class MockAuthService {
  /**
   * Get default mock user (CANDIDATO role)
   *
   * This user has full access to all features.
   * Use for development and testing.
   */
  getMockUser(): MockUser {
    return {
      id: '550e8400-e29b-41d4-a716-446655440000', // Valid UUID format
      email: 'candidato@example.com',
      name: 'João Silva',
      role: 'CANDIDATO',
      tenantId: '650e8400-e29b-41d4-a716-446655440000', // Valid UUID format
      keycloakId: '750e8400-e29b-41d4-a716-446655440000', // Valid UUID format
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Get mock user with specific role
   *
   * Useful for testing role-based access control
   */
  getMockUserWithRole(role: UserRole): MockUser {
    const roleEmails: Record<UserRole, string> = {
      CANDIDATO: 'candidato@example.com',
      ESTRATEGISTA: 'estrategista@example.com',
      LIDERANCA: 'lideranca@example.com',
      ESCRITORIO: 'escritorio@example.com',
    };

    const roleNames: Record<UserRole, string> = {
      CANDIDATO: 'João Silva (Candidato)',
      ESTRATEGISTA: 'Maria Santos (Estrategista)',
      LIDERANCA: 'Pedro Oliveira (Liderança)',
      ESCRITORIO: 'Ana Costa (Escritório)',
    };

    const roleUUIDs: Record<UserRole, string> = {
      CANDIDATO: '550e8400-e29b-41d4-a716-446655440000',
      ESTRATEGISTA: '550e8400-e29b-41d4-a716-446655440001',
      LIDERANCA: '550e8400-e29b-41d4-a716-446655440002',
      ESCRITORIO: '550e8400-e29b-41d4-a716-446655440003',
    };

    return {
      id: roleUUIDs[role],
      email: roleEmails[role],
      name: roleNames[role],
      role,
      tenantId: '650e8400-e29b-41d4-a716-446655440000',
      keycloakId: `750e8400-e29b-41d4-a716-446655440${Object.keys(roleUUIDs).indexOf(role)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Get mock tenant ID
   *
   * For multi-tenancy testing
   */
  getMockTenantId(): string {
    return '650e8400-e29b-41d4-a716-446655440000';
  }

  /**
   * Validate if user has required role
   *
   * Simulates RBAC logic
   */
  hasRole(user: MockUser, allowedRoles: UserRole[]): boolean {
    return allowedRoles.includes(user.role);
  }

  /**
   * Get multiple mock users for testing
   *
   * Returns users with different roles
   */
  getAllMockUsers(): MockUser[] {
    const roles: UserRole[] = ['CANDIDATO', 'ESTRATEGISTA', 'LIDERANCA', 'ESCRITORIO'];
    return roles.map((role) => this.getMockUserWithRole(role));
  }
}
