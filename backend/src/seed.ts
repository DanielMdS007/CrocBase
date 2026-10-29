import 'reflect-metadata';
import dataSource from './data-source.js';
import { seedExampleMember } from './database/seeds/example-member.seed.js';

try {
  await dataSource.initialize();
  await seedExampleMember(dataSource);
} catch (error) {
  console.error('Falha ao executar as seeds:', error);
  process.exitCode = 1;
} finally {
  if (dataSource.isInitialized) await dataSource.destroy();
}
