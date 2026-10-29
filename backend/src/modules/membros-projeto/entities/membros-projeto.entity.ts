import { Column, Entity, PrimaryColumn } from 'typeorm';
import { CargoProjeto } from '../../../authorization/enums/cargo-projeto.enum.js';

@Entity({ name: 'MembrosProjeto' })
export class MembrosProjeto {
  @PrimaryColumn({ type: 'int' })
  idMembro!: number;

  @PrimaryColumn({ type: 'int' })
  idProjeto!: number;

  @Column({ type: 'enum', enum: CargoProjeto })
  CargoProjeto!: CargoProjeto;
}
