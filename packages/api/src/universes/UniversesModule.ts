import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'

import {Universe} from './data/UniverseEntity'

@Module({
  imports: [TypeOrmModule.forFeature([Universe])],
})
export class UniversesModule {}

export default UniversesModule
