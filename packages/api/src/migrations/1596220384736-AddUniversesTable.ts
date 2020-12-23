import {MigrationInterface, QueryRunner} from 'typeorm'

export class AddUniversesTable1596220384736 implements MigrationInterface {
  name = 'AddUniversesTable1596220384736'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "universes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "name" character varying(300) NOT NULL,
        "description" jsonb,
        "owner_profile_id" uuid NOT NULL,
        CONSTRAINT "universes__id__primary_key" PRIMARY KEY ("id")
      )
    `)
    await queryRunner.query(`
      ALTER TABLE "universes" ADD CONSTRAINT "universes__owner_profile_id__foreign_key"
        FOREIGN KEY ("owner_profile_id")
        REFERENCES "profiles"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "universes" DROP CONSTRAINT "universes__owner_profile_id__foreign_key"`
    )
    await queryRunner.query(`DROP TABLE "universes"`)
  }
}
