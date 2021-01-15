import {MigrationInterface, QueryRunner} from 'typeorm'

export class AddUsersTable1596218300476 implements MigrationInterface {
  name = 'AddUsersTable1596218300476'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "username" character varying(300) NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "profile_id" uuid NOT NULL,
        CONSTRAINT "users__id__primary_key" PRIMARY KEY ("id"),
        CONSTRAINT "users__username__unique" UNIQUE ("username"),
        CONSTRAINT "users__profile_id__foreign_key"
          FOREIGN KEY ("profile_id")
          REFERENCES "profiles"("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`)
  }
}
