import Knex from 'knex'

import * as Config from '../src/Config'

const dbName = `${Config.Knex.config.connection.database}_test`

// A module-scoped pointer to Knex so that it's only initialized once
let _knex: Knex | undefined = undefined

export const testEndpoint = 'http://localhost:4001/graphql'

// Create a Knex client, or return the already initialized one
export const getDb = () => {
  if (!_knex) {
    _knex = Knex({
      ...Config.Knex.config,
      connection: {
        ...Config.Knex.config.connection,
        database: dbName,
      },
    })
  }

  return _knex
}

// Wipe out and re-create the test db
export const initTestDb = async () => {
  // Use the primary config to manage the test database
  const db = Knex(Config.Knex.config)

  await db.raw(`DROP DATABASE IF EXISTS ${dbName};`)
  await db.raw(`CREATE DATABASE ${dbName};`)

  // Use the test config above to run migrations
  const knex = getDb()

  await knex.migrate.latest()
}

export default {testEndpoint, getDb, initTestDb}
