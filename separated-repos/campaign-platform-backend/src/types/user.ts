export type UserRole = 'CANDIDATO' | 'ESTRATEGISTA' | 'LIDERANCA' | 'ESCRITORIO';

export interface User {
    id: string;
    keycloakId: string;
    email: string;
    name: string;
    role: UserRole;
    createdAt: Date | string;
    updatedAt: Date | string;
    deletedAt?: Date | string | null;
}

export interface CreateUserRequest {
    keycloakId: string;
    email: string;
    name: string;
    role: UserRole;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> { }
