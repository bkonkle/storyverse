import {Inject, Injectable} from '@nestjs/common'

import {Vars, getVar, getVars} from './Environment'

export {Vars}

export const ProcessEnv = 'ConfigService:ProcessEnv'

@Injectable()
export class ConfigService {
  constructor(@Inject(ProcessEnv) private readonly env: NodeJS.ProcessEnv) {}

  getVar = (key: Vars) => getVar(key, this.env)

  getVars = (keys: Vars[]) => getVars(keys, this.env)
}

export default ConfigService
