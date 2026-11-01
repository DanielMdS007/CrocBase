import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity.js';
import { PessoaService } from './pessoa.service.js';
import { PessoaController } from './pessoa.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Pessoa])],
  controllers: [PessoaController],
  providers: [PessoaService],
})
export class PessoaModule {}
