import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'

import {Profile} from './data/ProfileEntity'

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
})
export class ProfilesModule {}

export default ProfilesModule
