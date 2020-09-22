import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'

import User from './User.entity'
import {UserResolvers} from './UserResolvers'
import {UsersService} from './UsersService'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserResolvers, UsersService],
})
export class UsersModule {}

export default UsersModule
