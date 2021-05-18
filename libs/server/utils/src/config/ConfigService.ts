import {injectable, inject} from 'tsyringe'

import {Config} from './ConfigTypes'

@injectable()
export default class ConfigService {
  constructor(@inject(Config) private readonly config: Config) {}

  get = this.config.get.bind(this.config)

  set = this.config.set.bind(this.config)

  has = this.config.has.bind(this.config)

  default = this.config.default.bind(this.config)

  validate = this.config.validate.bind(this.config)

  getProperties = this.config.getProperties.bind(this.config)

  toString = this.config.toString.bind(this.config)
}
