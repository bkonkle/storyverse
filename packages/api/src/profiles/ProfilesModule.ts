import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'

import Profile from './Profile.entity'
import {ProfileResolvers} from './ProfileResolvers'
import {ProfilesService} from './ProfilesService'

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  providers: [ProfileResolvers, ProfilesService],
})
export class ProfilesModule {}

export default ProfilesModule
