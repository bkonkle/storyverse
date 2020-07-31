import {MigrationInterface, QueryRunner, Table} from 'typeorm'

export class AddUsersTable1596164323589 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v1mc()',
          },

          {
            name: 'username',
            type: 'varchar',
            isNullable: false,
          },

          {
            name: 'is_active',
            type: 'boolean',
            isNullable: false,
            default: true,
          },

          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },

          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users')
  }
}
