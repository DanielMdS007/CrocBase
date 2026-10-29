import { AuthorizationService } from './authorization.service.js';
import { Cargo } from './enums/cargo.enum.js';
import { CargoProjeto } from './enums/cargo-projeto.enum.js';

describe('AuthorizationService', () => {
  const membros = { findOne: vi.fn() };
  const projetos = { findOne: vi.fn() };
  const service = new AuthorizationService(membros as never, projetos as never);

  beforeEach(() => vi.resetAllMocks());

  it('allows an administrator on a project without membership', async () => {
    membros.findOne.mockResolvedValue({ idMembro: 1, Cargo: Cargo.ADMINISTRADOR });
    expect(await service.hasProjectRole(1, 30, [CargoProjeto.LIDER])).toBe(true);
    expect(projetos.findOne).not.toHaveBeenCalled();
  });

  it('denies a member without project association', async () => {
    membros.findOne.mockResolvedValue({ idMembro: 2, Cargo: Cargo.MEMBRO });
    projetos.findOne.mockResolvedValue(null);
    expect(await service.hasProjectRole(2, 30, [CargoProjeto.LIDER])).toBe(false);
  });

  it('permits matching roles and scopes each role to its project', async () => {
    membros.findOne.mockResolvedValue({ idMembro: 3, Cargo: Cargo.MEMBRO });
    projetos.findOne.mockImplementation(async ({ where }) =>
      where.idProjeto === 10
        ? { idMembro: 3, CargoProjeto: CargoProjeto.LIDER }
        : { idMembro: 3, CargoProjeto: CargoProjeto.MODERADOR },
    );
    expect(await service.hasProjectRole(3, 10, [CargoProjeto.LIDER])).toBe(true);
    expect(await service.hasProjectRole(3, 20, [CargoProjeto.LIDER])).toBe(false);
    expect(await service.hasProjectRole(3, 20, [CargoProjeto.MODERADOR])).toBe(true);
  });

  it('denies absent associations and does not treat project roles as global roles', async () => {
    membros.findOne.mockResolvedValue({ idMembro: 4, Cargo: Cargo.MEMBRO });
    projetos.findOne.mockResolvedValue(null);
    expect(await service.isProjectMember(4, 99)).toBe(false);
    expect(await service.hasGlobalRole(4, [Cargo.ADMINISTRADOR])).toBe(false);
  });
});
