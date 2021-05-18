import convict from 'convict'
import {ValueProvider, InjectionToken} from 'tsyringe'

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
