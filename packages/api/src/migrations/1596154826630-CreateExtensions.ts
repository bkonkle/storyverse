import {MigrationInterface, QueryRunner} from 'typeorm'

export class CreateExtensions1596154826630 implements MigrationInterface {
  name = 'CreateExtensions1596154826630'

  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query('DROP EXTENSION IF EXISTS "uuid-ossp"')
  }
}
