import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membro } from '../modules/membros/entities/membro.entity.js';
import { MembrosProjeto } from '../modules/membros-projeto/entities/membros-projeto.entity.js';
import { AuthorizationService } from './authorization.service.js';
import { AuthorizationGuard } from './guards/authorization.guard.js';

@Module({
  imports: [TypeOrmModule.forFeature([Membro, MembrosProjeto])],
  providers: [AuthorizationService, AuthorizationGuard],
  exports: [AuthorizationService, AuthorizationGuard],
})
export class AuthorizationModule {}
