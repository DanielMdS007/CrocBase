import { SetMetadata } from '@nestjs/common';
import { CargoProjeto } from '../enums/cargo-projeto.enum.js';

export const REQUIRED_PROJECT_ROLES = 'authorization:project-roles';
export const RequireProjectRole = (...roles: CargoProjeto[]) =>
  SetMetadata(REQUIRED_PROJECT_ROLES, roles);
