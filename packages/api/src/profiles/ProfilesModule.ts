import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'

import Profile from './Profile.entity'
import UsersModule from '../users/UsersModule'
import ProfileAuthz from './ProfileAuthz'
import ProfileResolvers from './ProfileResolvers'
import ProfilesService from './ProfilesService'

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Profile])],
  providers: [ProfileAuthz, ProfileResolvers, ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}

export default ProfilesModule
