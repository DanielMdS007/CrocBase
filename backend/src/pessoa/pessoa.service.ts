import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto.js';
import { UpdatePessoaDto } from './dto/update-pessoa.dto.js';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pessoa } from './entities/pessoa.entity.js';

@Injectable()
export class PessoaService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly repository: Repository<Pessoa>,
  ) {}

  async create(createPessoaDto: CreatePessoaDto) {
    const pessoa = this.repository.create({
      ...createPessoaDto,
      senha: await argon2.hash(createPessoaDto.senha),
    });
    const salva = await this.repository.save(pessoa);
    return {
      id: salva.id,
      nome: salva.nome,
      email: salva.email,
    };
  }

  findAll() {
    return this.repository.find({
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });
  }

  async findOne(id: number) {
    const pessoa = await this.repository.findOne({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });

    if (!pessoa) {
      throw new NotFoundException(`Pessoa com ID ${id} não encontrada`);
    }

    return pessoa;
  }
  async update(id: number, updatePessoaDto: UpdatePessoaDto) {
    const pessoa = await this.repository.findOneBy({ id });

    if (!pessoa) {
      throw new NotFoundException(`Pessoa com ID ${id} não encontrada`);
    }

    if (updatePessoaDto.nome !== undefined) {
      pessoa.nome = updatePessoaDto.nome;
    }

    if (updatePessoaDto.email !== undefined) {
      pessoa.email = updatePessoaDto.email;
    }

    if (updatePessoaDto.senha !== undefined) {
      pessoa.senha = await argon2.hash(updatePessoaDto.senha);
    }

    const salva = await this.repository.save(pessoa);

    return {
      id: salva.id,
      nome: salva.nome,
      email: salva.email,
    };
  }

  async remove(id: number) {
    const resultado = await this.repository.delete(id);

    if (!resultado.affected) {
      throw new NotFoundException(`Pessoa com ID ${id} não encontrada`);
    }

    return { mensagem: 'Pessoa removida com sucesso' };
  }
}
