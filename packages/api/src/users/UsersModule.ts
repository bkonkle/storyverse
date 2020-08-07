import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'

import User from './data/User'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}

export default UsersModule