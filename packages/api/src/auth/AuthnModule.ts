import {Module} from '@nestjs/common'
import {PassportModule} from '@nestjs/passport'

import ConfigModule from '../config/ConfigModule'
import {JwtStrategy} from './JwtStrategy'

@Module({
  imports: [ConfigModule, PassportModule.register({defaultStrategy: 'jwt'})],
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class AuthnModule {}
