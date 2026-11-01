import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PessoaService } from './pessoa.service.js';
import { Pessoa } from './entities/pessoa.entity.js';

describe('PessoaService', () => {
  let service: PessoaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PessoaService,
        {
          provide: getRepositoryToken(Pessoa),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PessoaService>(PessoaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
