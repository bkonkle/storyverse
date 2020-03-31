/* tslint:disable await-promise */
import {
  knex as Knex,
  primaryUuid,
  foreignUuid,
  updateTimestamp,
} from '@graft/knex'

export async function up(knex: Knex) {
  await knex.schema.createTable('profiles', table => {
    primaryUuid(knex, table)

    table.timestamps(true, true)

    // fields
    table.string('display_name').comment('A display name')

    table.string('email').comment('An email address')

    table.string('picture').comment('A Profile photo')

    table.jsonb('content').comment('Editor json profile content')

    table.string('city').comment("The User''s city")

    table.string('state_province').comment("The User''s state or province")

    // relationships
    foreignUuid(
      table,
      'user_id',
      {
        column: 'id',
        table: 'users',
      },
      true
    ).comment('The User that created the Profile.')
  })

  await updateTimestamp(knex, 'profiles')

  await knex.raw(
    `GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE profiles TO storyverse_user;`
  )

  await knex.raw(`ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;`)

  // Open read policy
  await knex.raw(`
    CREATE POLICY profiles_select_policy ON profiles
      FOR SELECT
      USING (true);
  `)

  // Same-user policy for everything else
  await knex.raw(`
    CREATE POLICY profiles_same_user_policy ON profiles
      USING (
        user_id IN (
          SELECT id FROM users u
          WHERE u.username = current_setting('jwt.claims.sub')
        )
      );
  `)
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('profiles')
}
