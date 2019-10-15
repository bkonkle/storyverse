import dotenv from 'dotenv'
import parseDbUrl from 'parse-database-url'

dotenv.config()

export namespace Database {
  const _url =
    process.env.DATABASE_URL ||
    'postgres://storyverse_root:password@localhost:5432/storyverse'

  const _config = parseDbUrl(_url)

  export const user = process.env.DATABASE_USERNAME || _config.user
  export const password = process.env.DATABASE_PASSWORD || _config.password
  export const host = process.env.DATABASE_HOSTNAME || _config.host
  export const port = Number(process.env.DATABASE_PORT || _config.port)
  export const database = process.env.DATABASE_NAME || _config.database

  export const poolMin = Number(process.env.DATABASE_POOL_MIN || '0')
  export const poolMax = Number(process.env.DATABASE_POOL_MAX || '10')
  export const poolIdle = Number(process.env.DATABASE_POOL_IDLE || '10000')

  export const url = `postgres://${user}:${password}@${host}:${port}/${database}`
}

export namespace Knex {
  export const config = {
    client: 'postgresql',
    connection: {
      host: Database.host,
      database: Database.database,
      user: Database.user,
      password: Database.password,
      port: Database.port,
    },
    pool: {
      min: Database.poolMin,
      max: Database.poolMax,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  }
}

export namespace Server {
  export const port = Number(process.env.PORT || '4000')
  export const bodyLimit = '100kb'
  export const corsHeaders = ['Link']
}

export namespace Environment {
  export const isDev = process.env.NODE_ENV === 'development'
}

export default {Database, Server, Environment}
