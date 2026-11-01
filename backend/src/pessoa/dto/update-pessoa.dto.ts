import { PartialType } from '@nestjs/swagger';
import { CreatePessoaDto } from './create-pessoa.dto.js';

export class UpdatePessoaDto extends PartialType(CreatePessoaDto) {}
