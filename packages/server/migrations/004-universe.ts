/* tslint:disable await-promise */
import {
  knex as Knex,
  primaryUuid,
  foreignUuid,
  updateTimestamp,
} from '@graft/knex'

export async function up(knex: Knex) {
  await knex.schema.createTable('universes', table => {
    primaryUuid(knex, table)

    table.timestamps(true, true)

    // fields
    table.string('name').comment('A name for the Universe')

    table
      .jsonb('description')
      .comment("Editor json for the Universe''s description")

    // relationships
    foreignUuid(
      table,
      'owned_by_profile_id',
      {
        column: 'id',
        table: 'profiles',
      },
      true
    ).comment('The Profile that owns the Universe.')
  })

  await updateTimestamp(knex, 'universes')

  await knex.raw(
    `GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE universes TO storyverse_user;`
  )

  // Moderators
  await knex.schema.createTable('universe_moderators', table => {
    primaryUuid(knex, table)

    foreignUuid(
      table,
      'profile_id',
      {
        column: 'id',
        table: 'profiles',
      },
      true
    ).comment('The Profile that this row grants Moderator status to')

    foreignUuid(
      table,
      'universe_id',
      {
        column: 'id',
        table: 'universes',
      },
      true
    ).comment('The Universe that this row grants Moderator status for')

    table.timestamps(true, true)
  })

  await updateTimestamp(knex, 'universe_moderators')

  await knex.raw(
    `GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE universe_moderators TO storyverse_user;`
  )

  // Security - Universes

  await knex.raw(`ALTER TABLE universes ENABLE ROW LEVEL SECURITY;`)

  // SELECT policy
  await knex.raw(`
    CREATE POLICY universes_select_policy ON universes
      FOR SELECT
      USING (true);
  `)

  // Policy for everything else
  await knex.raw(`
    CREATE POLICY universes_modify_policy ON universes
      USING (
        owned_by_profile_id IN (
          SELECT p.id FROM profiles p
          INNER JOIN users u ON u.id = p.user_id
          WHERE u.username = current_setting('jwt.claims.sub')
        )
        OR id IN (
          SELECT um.universe_id FROM universe_moderators um
          INNER JOIN profiles p ON p.id = um.profile_id
          INNER JOIN users u ON u.id = p.user_id
          WHERE u.username = current_setting('jwt.claims.sub')
        )
      );
  `)

  // Security - Universe Moderators
  await knex.raw(`ALTER TABLE universe_moderators ENABLE ROW LEVEL SECURITY;`)

  // SELECT policy
  await knex.raw(`
    CREATE POLICY universe_moderators_select_policy ON universe_moderators
      FOR SELECT
      USING (true);
  `)

  // Policy for everything else
  await knex.raw(`
    CREATE POLICY universe_moderators_modify_policy ON universe_moderators
      USING (true)
      WITH CHECK (
        profile_id IN (
          SELECT uv.owned_by_profile_id FROM universes uv
          INNER JOIN profiles p ON p.id = uv.owned_by_profile_id
          INNER JOIN users u ON u.id = p.user_id
          WHERE u.username = current_setting('jwt.claims.sub')
        )
        OR universe_id IN (
          SELECT um.universe_id FROM universe_moderators um
          INNER JOIN profiles p ON p.id = um.profile_id
          INNER JOIN users u ON u.id = p.user_id
          WHERE u.username = current_setting('jwt.claims.sub')
        )
      );
  `)
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('universes')
}
