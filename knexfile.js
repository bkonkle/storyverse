require('ts-node/register/transpile-only')

const parseDbUrl = require('parse-database-url')
const dotenv = require('dotenv')

dotenv.config()

const DEFAULT_URL = 'postgres://storyverse_root:password@localhost:5432/storyverse'

const EnvironmentMap = {
  local: DEFAULT_URL,
  dev: process.env.DEV_DATABASE_URL || DEFAULT_URL,
}

const environment = process.env.ENVIRONMENT || 'local'

const dbUrl =
  process.env.DATABASE_URL ||
  EnvironmentMap[environment] ||
  EnvironmentMap.local

const dbConfig = parseDbUrl(dbUrl)

const tunnel = !!process.env.TUNNEL
const host = tunnel ? 'localhost' : dbConfig.host
const port = tunnel ? process.env.PORT || 1701 : dbConfig.port

module.exports = {
  client: 'postgresql',
  connection: {
    host: process.env.DATABASE_HOSTNAME || host || dbConfig.host,
    database: process.env.DATABASE_NAME || dbConfig.database,
    user: process.env.DATABASE_USERNAME || dbConfig.user,
    password: process.env.DATABASE_PASSWORD || dbConfig.password,
    port: process.env.DATABASE_PORT
      ? Number(process.env.DATABASE_PORT)
      : port || dbConfig.port,
  },
  pool: {
    min: Number(process.env.DATABASE_POOL_MIN || '0'),
    max: Number(process.env.DATABASE_POOL_MAX || '10'),
  },
  migrations: {
    tableName: 'knex_migrations',
  },
}
