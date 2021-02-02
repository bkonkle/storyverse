import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'

import AuthzModule from '../authorization/AuthzModule'
import ProfilesModule from '../profiles/ProfilesModule'
import Universe from './Universe.entity'
import {UniverseResolvers} from './UniverseResolvers'
import {UniversesService} from './UniversesService'
import Roles from './UniverseRoles'

@Module({
  imports: [
    ProfilesModule,
    TypeOrmModule.forFeature([Universe]),
    AuthzModule.register(Roles),
  ],
  providers: [UniverseResolvers, UniversesService],
  exports: [UniversesService],
})
export class UniversesModule {}

export default UniversesModule
