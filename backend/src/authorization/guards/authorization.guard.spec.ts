import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizationGuard } from './authorization.guard.js';
import { AuthorizationService } from '../authorization.service.js';
import { REQUIRED_GLOBAL_ROLES } from '../decorators/require-global-role.decorator.js';
import { REQUIRED_PROJECT_ROLES } from '../decorators/require-project-role.decorator.js';
import { Cargo } from '../enums/cargo.enum.js';
import { CargoProjeto } from '../enums/cargo-projeto.enum.js';

describe('AuthorizationGuard', () => {
  const reflector = { getAllAndOverride: vi.fn() };
  const authorization = { hasGlobalRole: vi.fn(), hasProjectRole: vi.fn() } as unknown as AuthorizationService;
  const guard = new AuthorizationGuard(reflector as unknown as Reflector, authorization);
  const handler = {};
  const cls = {};
  let request: { user?: { idMembro?: number }; params: Record<string, string> };

  function context(): ExecutionContext {
    return {
      getHandler: () => handler,
      getClass: () => cls,
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;
  }

  beforeEach(() => {
    vi.resetAllMocks();
    request = { user: { idMembro: 1 }, params: { projetoId: '5' } };
    reflector.getAllAndOverride.mockImplementation((key: string) =>
      key === REQUIRED_GLOBAL_ROLES ? undefined : [CargoProjeto.LIDER],
    );
    authorization.hasGlobalRole = vi.fn();
    authorization.hasProjectRole = vi.fn().mockResolvedValue(true);
  });

  it('returns 401 when no authenticated user exists', async () => {
    request.user = undefined;
    await expect(guard.canActivate(context())).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('allows a leader and forbids a moderator on leader-only routes', async () => {
    expect(await guard.canActivate(context())).toBe(true);
    expect(authorization.hasProjectRole).toHaveBeenCalledWith(1, 5, [CargoProjeto.LIDER]);
    (authorization.hasProjectRole as ReturnType<typeof vi.fn>).mockResolvedValue(false);
    await expect(guard.canActivate(context())).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('does not authorize missing or invalid project identifiers', async () => {
    request.params.projetoId = 'bad';
    await expect(guard.canActivate(context())).rejects.toBeInstanceOf(ForbiddenException);
    expect(authorization.hasProjectRole).not.toHaveBeenCalled();
  });

  it('checks declared global roles', async () => {
    reflector.getAllAndOverride.mockImplementation((key: string) =>
      key === REQUIRED_GLOBAL_ROLES ? [Cargo.ADMINISTRADOR] : undefined,
    );
    authorization.hasGlobalRole = vi.fn().mockResolvedValue(true);
    expect(await guard.canActivate(context())).toBe(true);
  });
});
