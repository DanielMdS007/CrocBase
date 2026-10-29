import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedExampleMember1760000001000 implements MigrationInterface {
  name = 'SeedExampleMember1760000001000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO \`Membro\` (\`Cargo\`)
      SELECT 'MEMBRO'
      WHERE NOT EXISTS (SELECT 1 FROM \`Membro\`)
    `);
  }

  async down(): Promise<void> {
    // Preserve the row because it has no stable identifier if the table was pre-populated.
  }
}
