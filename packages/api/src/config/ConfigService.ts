import {Inject, Injectable} from '@nestjs/common'

import {EnvKeys, getEnv} from './Environment'

export {EnvKeys}

export const ProcessEnv = 'ConfigService:ProcessEnv'

@Injectable()
export class ConfigService {
  constructor(@Inject(ProcessEnv) private readonly env: NodeJS.ProcessEnv) {}

  get = (key: EnvKeys, defaultValue?: string): string | undefined =>
    getEnv(key, defaultValue, this.env)
}

export default ConfigService
