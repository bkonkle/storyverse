import {MigrationInterface, QueryRunner} from 'typeorm'

export class AddProfilesTable1596218300476 implements MigrationInterface {
  name = 'AddProfilesTable1596218300476'

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
        "user_id" uuid NOT NULL,
        CONSTRAINT "profiles__id__primary_key" PRIMARY KEY ("id")
      )
    `)
    await queryRunner.query(`
      ALTER TABLE "profiles" ADD CONSTRAINT "profiles__user_id__foreign_key"
        FOREIGN KEY ("user_id")
        REFERENCES "users"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profiles" DROP CONSTRAINT "profiles__user_id__foreign_key"`
    )
    await queryRunner.query(`DROP TABLE "profiles"`)
  }
}
