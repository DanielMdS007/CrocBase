import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membro } from '../modules/membros/entities/membro.entity.js';
import { MembrosProjeto } from '../modules/membros-projeto/entities/membros-projeto.entity.js';
import { Cargo } from './enums/cargo.enum.js';
import { CargoProjeto } from './enums/cargo-projeto.enum.js';

@Injectable()
export class AuthorizationService {
  constructor(
    @InjectRepository(Membro) private readonly membros: Repository<Membro>,
    @InjectRepository(MembrosProjeto)
    private readonly membrosProjeto: Repository<MembrosProjeto>,
  ) {}

  async isAdministrator(userId: number): Promise<boolean> {
    const membro = await this.membros.findOne({
      where: { idMembro: userId },
      select: { idMembro: true, Cargo: true },
    });
    return membro?.Cargo === Cargo.ADMINISTRADOR;
  }

  async hasGlobalRole(userId: number, roles: Cargo[]): Promise<boolean> {
    if (await this.isAdministrator(userId)) return true;
    if (roles.includes(Cargo.ADMINISTRADOR)) return false;
    const membro = await this.membros.findOne({
      where: { idMembro: userId },
      select: { idMembro: true, Cargo: true },
    });
    return !!membro && roles.includes(membro.Cargo);
  }

  async isProjectMember(userId: number, projectId: number): Promise<boolean> {
    if (await this.isAdministrator(userId)) return true;
    return !!(await this.membrosProjeto.findOne({
      where: { idMembro: userId, idProjeto: projectId },
      select: { idMembro: true },
    }));
  }

  async hasProjectRole(
    userId: number,
    projectId: number,
    roles: CargoProjeto[],
  ): Promise<boolean> {
    if (await this.isAdministrator(userId)) return true;
    const membership = await this.membrosProjeto.findOne({
      where: { idMembro: userId, idProjeto: projectId },
      select: { idMembro: true, CargoProjeto: true },
    });
    return !!membership && roles.includes(membership.CargoProjeto);
  }
}
