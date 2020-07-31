import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'

import Profile from './data/Profile'
import {ProfilesResolver} from './ProfilesResolver'

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  providers: [ProfilesResolver],
})
export class ProfilesModule {}

export default ProfilesModule
