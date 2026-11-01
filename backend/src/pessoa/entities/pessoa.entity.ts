import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pessoas')

export class Pessoa {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    nome!: string;
    @Column({ unique: true, length: 255 })
    email!: string;
    @Column({ length: 255 })
    senha!: string;

}
