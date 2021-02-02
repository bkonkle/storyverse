import dotenv from 'dotenv'
import expand from 'dotenv-expand'

expand(dotenv.config())

export enum Vars {
  NodeEnv = 'NODE_ENV',

  // Server
  Port = 'PORT',

  // Database
  DbHostname = 'DATABASE_HOSTNAME',
  DbUsername = 'DATABASE_USERNAME',
  DbPassword = 'DATABASE_PASSWORD',
  DbName = 'DATABASE_NAME',
  DbPort = 'DATABASE_PORT',
  DbDebugLogging = 'DATABASE_DEBUG_LOGGING',
  DbPoolMin = 'DATABASE_POOL_MIN',
  DbPoolMax = 'DATABASE_POOL_MAX',
  SshKeyPath = 'SSH_KEY_PATH',
  BastionHost = 'BASTION_HOST',

  // Authentication
  OAuth2Audience = 'OAUTH2_AUDIENCE',
  OAuth2Issuer = 'OAUTH2_ISSUER',
}

export const getVars = (keys: Vars[], env: NodeJS.ProcessEnv = process.env) =>
  keys.map((key) => env[key])
