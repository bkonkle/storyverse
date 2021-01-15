import {MigrationInterface, QueryRunner} from 'typeorm'

export class AddProfilesTable1596216678335 implements MigrationInterface {
  name = 'AddProfilesTable1596216678335'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "profiles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "email" character varying(300) NOT NULL,
        "display_name" character varying(300),
        "picture" text,
        "content" jsonb,
        "city" character varying(300),
        "state_province" character varying(300),
        CONSTRAINT "profiles__id__primary_key" PRIMARY KEY ("id")
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "profiles"`)
  }
}
