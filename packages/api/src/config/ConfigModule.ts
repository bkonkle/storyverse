import {Module} from '@nestjs/common'

import {ProcessEnv, ConfigService} from './ConfigService'

@Module({
  providers: [
    ConfigService,
    {
      provide: ProcessEnv,
      useValue: process.env,
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}

export default ConfigModule
