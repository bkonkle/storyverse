import {MigrationInterface, QueryRunner} from 'typeorm'

export class AddAuthorization1608733349921 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
     * Permissions are granular actions that an authorized user is permitted to perform.
     */
    await queryRunner.query(`
      CREATE TABLE "permissions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "key" character varying(300) NOT NULL,
        "name" character varying(300) NOT NULL,
        "description" jsonb,
        CONSTRAINT "permissions__key__unique" UNIQUE ("key"),
        CONSTRAINT "permissions__id__primary_key" PRIMARY KEY ("id")
      )
    `)

    /**
     * Roles are collections of permissions that can be granted to a user.
     */
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "key" character varying(300) NOT NULL,
        "name" character varying(300) NOT NULL,
        "description" jsonb,
        CONSTRAINT "roles__key__unique" UNIQUE ("key"),
        CONSTRAINT "roles__id__primary_key" PRIMARY KEY ("id")
      )
    `)

    /**
     * RolePermissions associate permissions with roles.
     */
    await queryRunner.query(`
      CREATE TABLE "role_permissions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "role_id" uuid NOT NULL,
        "permission_id" uuid NOT NULL,
        CONSTRAINT "role_permissions__id__primary_key" PRIMARY KEY ("id")
      )
    `)
    await queryRunner.query(`
      ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions__role_id__foreign_key"
        FOREIGN KEY ("role_id")
        REFERENCES "roles"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE
    `)
    await queryRunner.query(`
      ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions__permission_id__foreign_key"
        FOREIGN KEY ("permission_id")
        REFERENCES "permissions"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE
    `)

    /**
     * RoleGrants associate roles with profiles in the context of a generic subject relationship.
     */
    await queryRunner.query(`
      CREATE TABLE "role_grants" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "role_id" uuid NOT NULL,
        "profile_id" uuid NOT NULL,
        "subject_table" character varying(300) NOT NULL,
        "subject_id" uuid NOT NULL,
        CONSTRAINT "role_grants__id__primary_key" PRIMARY KEY ("id")
      )
    `)
    await queryRunner.query(`
      ALTER TABLE "role_grants" ADD CONSTRAINT "role_grants__role_id__foreign_key"
        FOREIGN KEY ("role_id")
        REFERENCES "roles"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE
    `)
    await queryRunner.query(`
      ALTER TABLE "role_grants" ADD CONSTRAINT "role_grants__profile_id__foreign_key"
        FOREIGN KEY ("profile_id")
        REFERENCES "profiles"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_grants" DROP CONSTRAINT "role_grants__profile_id__foreign_key"`
    )
    await queryRunner.query(
      `ALTER TABLE "role_grants" DROP CONSTRAINT "role_grants__role_id__foreign_key"`
    )
    await queryRunner.query(`DROP TABLE "role_grants"`)

    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions__permission_id__foreign_key"`
    )
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions__role_id__foreign_key"`
    )
    await queryRunner.query(`DROP TABLE "role_permissions"`)

    await queryRunner.query(`DROP TABLE "roles"`)

    await queryRunner.query(`DROP TABLE "permissions"`)
  }
}
