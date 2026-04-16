import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateApontamentoOSTable1713070000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "apontamento_os" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "os_id" uuid NOT NULL,
        "tecnico_id" uuid NOT NULL,
        "inicio_em" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "fim_em" timestamptz,
        "observacao" text,
        "criado_em" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_apontamento_os_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_apontamento_os_ordem" FOREIGN KEY ("os_id") REFERENCES "ordem_servico"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_apontamento_os_tecnico" FOREIGN KEY ("tecnico_id") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_apontamento_os_os_id" ON "apontamento_os" ("os_id")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_apontamento_os_tecnico_id" ON "apontamento_os" ("tecnico_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_apontamento_os_tecnico_id"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_apontamento_os_os_id"
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS "apontamento_os"
    `);
  }
}
