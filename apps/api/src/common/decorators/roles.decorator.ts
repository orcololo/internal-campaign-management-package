import { SetMetadata } from '@nestjs/common';

export enum UserRole {
  CANDIDATO = 'CANDIDATO',
  ESTRATEGISTA = 'ESTRATEGISTA',
  LIDERANCA = 'LIDERANCA',
  ESCRITORIO = 'ESCRITORIO',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
