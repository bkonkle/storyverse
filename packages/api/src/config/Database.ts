import {LoggerOptions} from 'typeorm/logger/LoggerOptions'
import {PostgresConnectionOptions} from 'typeorm/driver/postgres/PostgresConnectionOptions'

import {EnvKeys, getEnv} from './Environment'

const appName = 'storyverse'
const env = getEnv(EnvKeys.NodeEnv, 'production')
const dbHost = getEnv(EnvKeys.DbHostname, 'localhost')
const dbName = env === 'test' ? `${appName}_test` : appName

const logging: LoggerOptions =
  env === 'production' ? ['error'] : ['error', 'query', 'schema']

const config: PostgresConnectionOptions = {
  type: 'postgres',

  host: dbHost,
  port: Number(getEnv(EnvKeys.DbPort, '5432')),
  username: getEnv(EnvKeys.DbUsername, appName),
  password: getEnv(EnvKeys.DbPassword, appName),
  database: dbName,

  entities: [__dirname + '/../**/*Entity{.ts,.js}'],

  // Use manual migrations
  synchronize: false,
  migrationsRun: false,

  logging,

  // Silence DB logs in tests
  logger:
    env === 'test' || getEnv(EnvKeys.DbDebugLogging) === 'false'
      ? 'file'
      : 'advanced-console',

  // Allow both start.prod and start.dev to use migrations.
  // __dirname points to either the dist/ or src/ folder, meaning
  // either the compiled JS in Prod or the TS in Dev.
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    // Migrations should be inside the src/ folder
    // to be compiled into the dist/ folder.
    migrationsDir: 'src/migrations',
  },
}

export = config
