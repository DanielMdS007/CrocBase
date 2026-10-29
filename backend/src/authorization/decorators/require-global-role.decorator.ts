import { SetMetadata } from '@nestjs/common';
import { Cargo } from '../enums/cargo.enum.js';

export const REQUIRED_GLOBAL_ROLES = 'authorization:global-roles';
export const RequireGlobalRole = (...roles: Cargo[]) =>
  SetMetadata(REQUIRED_GLOBAL_ROLES, roles);
