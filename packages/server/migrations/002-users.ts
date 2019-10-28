/* tslint:disable await-promise */
import Knex from 'knex'

import {KnexUtils} from '@graft/server'

export async function up(knex: Knex) {
  await knex.schema.createTable('users', table => {
    KnexUtils.primaryUuid(knex, table)

    table.timestamps(true, true)

    // fields
    table
      .string('username')
      .unique()
      .notNullable()
      .comment(`The User''s login id - usually their email address.`)

    table
      .boolean('is_active')
      .comment(`If false, the User is suspended.`)
      .defaultTo(true)
  })

  await KnexUtils.updateTimestamp(knex, 'users')

  await knex.raw(
    `GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE users TO storyverse_user;`
  )
  await knex.raw(`ALTER TABLE users ENABLE ROW LEVEL SECURITY;`)

  await knex.raw(`
    CREATE POLICY user_same_user_policy ON users
      USING (username = current_setting('jwt.claims.sub'))
      WITH CHECK (username = current_setting('jwt.claims.sub'));
  `)
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('users')
}
