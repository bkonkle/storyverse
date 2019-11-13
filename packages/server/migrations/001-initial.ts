/* tslint:disable await-promise */
import {knex as Knex} from '@graft/knex'

export async function up(knex: Knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')

  // timestamp updates
  await knex.raw(`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `)

  // ignore the migration tables
  await knex.raw(`COMMENT ON TABLE knex_migrations is E'@omit';`)
  await knex.raw(`COMMENT ON TABLE knex_migrations_lock is E'@omit';`)

  // access roles
  await knex.raw(
    `ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM public;`
  )

  await knex.raw(`
    DO
    $do$
    BEGIN
      IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_roles WHERE rolname = 'storyverse_user'
      ) THEN
        CREATE ROLE storyverse_user;
      END IF;
    END
    $do$;
  `)

  await knex.raw('GRANT storyverse_user TO storyverse_root;')
  await knex.raw('GRANT USAGE ON SCHEMA public TO storyverse_user;')
  await knex.raw(
    'GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO storyverse_user;'
  )
}

export function down(_knex: Knex) {
  throw new Error('Downward migrations are not supported. Restore from backup.')
}
