import {MigrationInterface, QueryRunner} from 'typeorm'

export class AddUsersTable1596216678335 implements MigrationInterface {
  name = 'AddUsersTable1596216678335'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "username" character varying(300) NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        CONSTRAINT "username__unique" UNIQUE ("username"),
        CONSTRAINT "id__primary_key" PRIMARY KEY ("id")
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`)
  }
}
