import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Cargo } from '../../../authorization/enums/cargo.enum.js';

@Entity({ name: 'Membro' })
export class Membro {
  @PrimaryGeneratedColumn({ name: 'idMembro' })
  idMembro!: number;

  @Column({ type: 'enum', enum: Cargo, default: Cargo.MEMBRO })
  Cargo!: Cargo;
}
