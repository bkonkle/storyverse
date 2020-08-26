import {LoggerOptions} from 'typeorm/logger/LoggerOptions'
import {PostgresConnectionOptions} from 'typeorm/driver/postgres/PostgresConnectionOptions'

import {Vars, getVars} from './Environment'

const appName = 'storyverse'

const [
  env = 'production',
  dbHost = 'localhost',
  dbPort = '5432',
  dbUser = appName,
  dbPass = appName,
  dbPoolMin = '0',
  dbPoolMax = '10',
  dbDebugLogging,
] = getVars([
  Vars.NodeEnv,
  Vars.DbHostname,
  Vars.DbPort,
  Vars.DbUsername,
  Vars.DbPassword,
  Vars.DbPoolMin,
  Vars.DbPoolMax,
  Vars.DbDebugLogging,
])

const dbName = env === 'test' ? `${appName}_test` : appName

const logging: LoggerOptions =
  env === 'production' ? ['error'] : ['error', 'query', 'schema']

const config: PostgresConnectionOptions = {
  type: 'postgres',

  host: dbHost,
  port: Number(dbPort),
  username: dbUser,
  password: dbPass,
  database: dbName,

  extra: {
    min: Number(dbPoolMin),
    max: Number(dbPoolMax),
  },

  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],

  synchronize: false,
  migrationsRun: true,

  logging,

  // Silence DB logs in tests
  logger:
    env === 'test' || dbDebugLogging === 'false' ? 'file' : 'advanced-console',

  // Allow both start.prod and start.dev to use migrations.
  // __dirname points to either the dist/ or src/ folder, meaning
  // either the compiled JS in Prod or the TS in Dev.
  migrations: [`${__dirname}/../migrations/**/*{.ts,.js}`],
  cli: {
    // Migrations should be inside the src/ folder
    // to be compiled into the dist/ folder.
    migrationsDir: 'src/migrations',
  },
}

export = config
