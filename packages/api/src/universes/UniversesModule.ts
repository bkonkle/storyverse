import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import ProfilesModule from '../profiles/ProfilesModule'

import Universe from './Universe.entity'
import {UniverseResolvers} from './UniverseResolvers'
import {UniversesService} from './UniversesService'

@Module({
  imports: [ProfilesModule, TypeOrmModule.forFeature([Universe])],
  providers: [UniverseResolvers, UniversesService],
  exports: [UniversesService],
})
export class UniversesModule {}

export default UniversesModule
