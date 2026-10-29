import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Membro } from './modules/membros/entities/membro.entity.js';
import { MembrosProjeto } from './modules/membros-projeto/entities/membros-projeto.entity.js';
import { CreateAuthorizationTables1760000000000 } from './database/migrations/1760000000000-CreateAuthorizationTables.js';
import { SeedExampleMember1760000001000 } from './database/migrations/1760000001000-SeedExampleMember.js';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Membro, MembrosProjeto],
  migrations: [
    CreateAuthorizationTables1760000000000,
    SeedExampleMember1760000001000,
  ],
  synchronize: false,
});
