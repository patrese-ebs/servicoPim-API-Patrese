import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddEquipamentoMetadata1713060000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "equipamento"
      ADD COLUMN IF NOT EXISTS "setor" character varying NOT NULL DEFAULT 'Operação'
    `);

    await queryRunner.query(`
      ALTER TABLE "equipamento"
      ADD COLUMN IF NOT EXISTS "numero_patrimonio" character varying
    `);

    await queryRunner.query(`
      ALTER TABLE "equipamento"
      ADD COLUMN IF NOT EXISTS "data_cadastro" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
    `);

    await queryRunner.query(`
      ALTER TABLE "equipamento"
      ADD COLUMN IF NOT EXISTS "ultima_revisao" date
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "equipamento"
      DROP COLUMN IF EXISTS "ultima_revisao"
    `);

    await queryRunner.query(`
      ALTER TABLE "equipamento"
      DROP COLUMN IF EXISTS "data_cadastro"
    `);

    await queryRunner.query(`
      ALTER TABLE "equipamento"
      DROP COLUMN IF EXISTS "numero_patrimonio"
    `);

    await queryRunner.query(`
      ALTER TABLE "equipamento"
      DROP COLUMN IF EXISTS "setor"
    `);
  }
}
