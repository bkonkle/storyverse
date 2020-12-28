import {MigrationInterface, QueryRunner} from 'typeorm'

export class AddAuthorization1608733349921 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
     * RoleGrants associate roles with profiles, optionally in the context of a generic subject
     * relationship.
     */
    await queryRunner.query(`
      CREATE TABLE "role_grants" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "role_key" character varying(300) NOT NULL,
        "profile_id" uuid NOT NULL,
        "subject_table" character varying(300),
        "subject_id" uuid,
        CONSTRAINT "role_grants__id__primary_key" PRIMARY KEY ("id"),
        CONSTRAINT "role_grants__profile_id__foreign_key"
          FOREIGN KEY ("profile_id")
          REFERENCES "profiles"("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "role_grants"`)
  }
}
