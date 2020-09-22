import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'

import Universe from './Universe.entity'
import {UniverseResolvers} from './UniverseResolvers'
import {UniversesService} from './UniversesService'

@Module({
  imports: [TypeOrmModule.forFeature([Universe])],
  providers: [UniverseResolvers, UniversesService],
})
export class UniversesModule {}

export default UniversesModule
