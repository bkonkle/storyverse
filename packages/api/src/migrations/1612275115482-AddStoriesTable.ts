import {MigrationInterface, QueryRunner} from 'typeorm'

export class AddStoriesTable1612275115482 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "stories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "name" character varying(300) NOT NULL,
        "volume" integer,
        "issue" integer,
        "summary" jsonb,
        "content" jsonb,
        "series_id" uuid NOT NULL,
        CONSTRAINT "stories__id__primary_key" PRIMARY KEY ("id"),
        CONSTRAINT "stories__series_id__foreign_key"
          FOREIGN KEY ("series_id")
          REFERENCES "series"("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "stories"`)
  }
}
