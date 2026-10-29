import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuthorizationTables1760000000000 implements MigrationInterface {
  name = 'CreateAuthorizationTables1760000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`Membro\` (
        \`idMembro\` int NOT NULL AUTO_INCREMENT,
        \`Cargo\` enum('ADMINISTRADOR','MEMBRO') NOT NULL DEFAULT 'MEMBRO',
        PRIMARY KEY (\`idMembro\`)
      ) ENGINE=InnoDB
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`MembrosProjeto\` (
        \`idMembro\` int NOT NULL,
        \`idProjeto\` int NOT NULL,
        \`CargoProjeto\` enum('LIDER','MODERADOR','MEMBRO') NOT NULL,
        PRIMARY KEY (\`idMembro\`, \`idProjeto\`),
        CONSTRAINT \`FK_MembrosProjeto_Membro\`
          FOREIGN KEY (\`idMembro\`) REFERENCES \`Membro\` (\`idMembro\`)
          ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `MembrosProjeto`');
    await queryRunner.query('DROP TABLE IF EXISTS `Membro`');
  }
}
