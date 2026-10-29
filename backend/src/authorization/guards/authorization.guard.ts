import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { AuthorizationService } from '../authorization.service.js';
import { REQUIRED_GLOBAL_ROLES } from '../decorators/require-global-role.decorator.js';
import { REQUIRED_PROJECT_ROLES } from '../decorators/require-project-role.decorator.js';
import { Cargo } from '../enums/cargo.enum.js';
import { CargoProjeto } from '../enums/cargo-projeto.enum.js';

type AuthenticatedRequest = Request & {
  user?: { idMembro?: number | string; id?: number | string };
};

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorization: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const globalRoles = this.reflector.getAllAndOverride<Cargo[]>(
      REQUIRED_GLOBAL_ROLES,
      [context.getHandler(), context.getClass()],
    );
    const projectRoles = this.reflector.getAllAndOverride<CargoProjeto[]>(
      REQUIRED_PROJECT_ROLES,
      [context.getHandler(), context.getClass()],
    );
    if (!globalRoles?.length && !projectRoles?.length) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const rawId = request.user?.idMembro ?? request.user?.id;
    const userId = typeof rawId === 'number' ? rawId : Number(rawId);
    if (!Number.isSafeInteger(userId) || userId <= 0) {
      throw new UnauthorizedException();
    }

    if (globalRoles?.length && !(await this.authorization.hasGlobalRole(userId, globalRoles))) {
      throw new ForbiddenException();
    }

    if (projectRoles?.length) {
      const rawProjectId = request.params.projetoId;
      const projectId = typeof rawProjectId === 'string' ? Number(rawProjectId) : NaN;
      if (!Number.isSafeInteger(projectId) || projectId <= 0) {
        throw new ForbiddenException();
      }
      if (!(await this.authorization.hasProjectRole(userId, projectId, projectRoles))) {
        throw new ForbiddenException();
      }
    }
    return true;
  }
}
