import convict from 'convict'
import * as json from 'json5'
import {ValueProvider, InjectionToken} from 'tsyringe'

convict.addParser({extension: 'json', parse: json.parse})

export interface Schema {
  env: string
  port: number
  db: {
    host: string
    username: string
    password: string
    name: string
    port: number
    url: string
    debug: boolean
    pool: {
      min: number | null
      max: number | null
    }
  }
  bastion: {
    key: string | null
    host: string | null
  }
  auth: {
    domain: string
    audience: string
    client: {
      id: string | null
      secret: string | null
    }
    test: {
      user: {
        username: string | null
        password: string | null
      }
      alt: {
        username: string | null
        password: string | null
      }
    }
  }
}

export type Config = convict.Config<Schema>

export const Config: InjectionToken<Config> = 'CONVICT_CONFIG'

export type ConfigProvider = ValueProvider<Config> & {
  token: InjectionToken<Config>
}

export const useConfig = (config: Config): ConfigProvider => ({
  token: Config,
  useValue: config,
})

export const schema: convict.Schema<Schema> = {
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  port: {
    doc: 'The port to bind to.',
    format: 'port',
    default: 4000,
    env: 'PORT',
    arg: 'port',
  },
  db: {
    host: {
      doc: 'Database host name/IP',
      format: String,
      default: 'localhost',
      env: 'DATABASE_HOSTNAME',
    },
    username: {
      doc: 'Database username',
      format: String,
      default: 'storyverse',
      env: 'DATABASE_USERNAME',
    },
    password: {
      doc: 'Database password',
      format: String,
      default: 'storyverse',
      env: 'DATABASE_PASSWORD',
      sensitive: true,
    },
    name: {
      doc: 'Database name',
      format: String,
      default: 'storyverse',
      env: 'DATABASE_NAME',
    },
    port: {
      doc: 'Database port',
      format: 'port',
      default: 1701,
      env: 'DATABASE_PORT',
    },
    url: {
      doc: 'Database url',
      format: String,
      default: 'postgresql://storyverse:storyverse@localhost:1701/storyverse',
      env: 'DATABASE_URL',
      arg: 'db-url',
    },
    debug: {
      doc: 'Database debug logging',
      format: Boolean,
      default: false,
      env: 'DATABASE_DEBUG_LOGGING',
      arg: 'db-debug',
    },
    pool: {
      min: {
        doc: 'Database pool min',
        format: 'int',
        default: null,
        env: 'DATABASE_POOL_MIN',
        arg: 'db-min',
      },
      max: {
        doc: 'Database pool max',
        format: 'int',
        default: null,
        env: 'DATABASE_POOL_MAX',
        arg: 'db-max',
      },
    },
  },
  bastion: {
    key: {
      doc: 'Bastion host SSH key path',
      format: String,
      default: null,
      env: 'SSH_KEY_PATH',
    },
    host: {
      doc: 'Bastion hostname',
      format: String,
      default: null,
      env: 'BASTION_HOST',
    },
  },
  auth: {
    domain: {
      doc: 'OAuth2 domain',
      format: String,
      default: 'storyverse-dev.auth0.com',
      env: 'OAUTH2_DOMAIN',
    },
    audience: {
      doc: 'OAuth2 audience',
      format: String,
      default: 'localhost',
      env: 'OAUTH2_AUDIENCE',
    },
    client: {
      id: {
        doc: 'OAuth2 client id',
        format: String,
        default: null,
        env: 'OAUTH2_CLIENT_ID',
      },
      secret: {
        doc: 'OAuth2 client secret',
        format: String,
        default: null,
        env: 'OAUTH2_CLIENT_SECRET',
        sensitive: true,
      },
    },
    test: {
      user: {
        username: {
          doc: 'Test user username',
          format: String,
          default: null,
          env: 'OAUTH2_TEST_USER',
        },
        password: {
          doc: 'Test user password',
          format: String,
          default: null,
          env: 'OAUTH2_TEST_PASS',
          sensitive: true,
        },
      },
      alt: {
        username: {
          doc: 'Alt test user username',
          format: String,
          default: null,
          env: 'OAUTH2_TEST_USER_ALT',
        },
        password: {
          doc: 'Alt test user password',
          format: String,
          default: null,
          env: 'OAUTH2_TEST_PASS_ALT',
          sensitive: true,
        },
      },
    },
  },
}

export default convict(schema)
