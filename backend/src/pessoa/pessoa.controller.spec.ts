import { Test, TestingModule } from '@nestjs/testing';
import { PessoaController } from './pessoa.controller.js';
import { PessoaService } from './pessoa.service.js';

describe('PessoaController', () => {
  let controller: PessoaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PessoaController],
      providers: [
        {
          provide: PessoaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PessoaController>(PessoaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
