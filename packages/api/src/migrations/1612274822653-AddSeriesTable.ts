import {MigrationInterface, QueryRunner} from 'typeorm'

export class AddSeriesTable1612274822653 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "series" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "name" character varying(300) NOT NULL,
        "description" jsonb,
        "universe_id" uuid NOT NULL,
        CONSTRAINT "series__id__primary_key" PRIMARY KEY ("id"),
        CONSTRAINT "series__universe_id__foreign_key"
          FOREIGN KEY ("universe_id")
          REFERENCES "universes"("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "series"`)
  }
}
