import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'

import AuthzModule from '../authorization/AuthzModule'
import ProfilesModule from '../profiles/ProfilesModule'
import Series from './Series.entity'
import {SeriesResolvers} from './SeriesResolvers'
import {SeriesService} from './SeriesService'
import SeriesAuthz from './SeriesAuthz'
import Roles from './SeriesRoles'

@Module({
  imports: [
    ProfilesModule,
    TypeOrmModule.forFeature([Series]),
    AuthzModule.register(Roles),
  ],
  providers: [SeriesAuthz, SeriesResolvers, SeriesService],
  exports: [SeriesService],
})
export default class SeriesModule {}
