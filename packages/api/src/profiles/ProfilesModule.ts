import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'

import Profile from './data/Profile'
import {ProfilesResolver} from './ProfilesResolver'
import {ProfilesService} from './ProfilesService'

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  providers: [ProfilesResolver, ProfilesService],
})
export class ProfilesModule {}

export default ProfilesModule
