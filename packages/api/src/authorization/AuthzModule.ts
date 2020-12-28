import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import ProfilesModule from '../profiles/ProfilesModule'

import RoleGrant from './RoleGrant.entity'
import RolesService from './RolesService'
import RoleGrantResolvers from './RoleGrantResolvers'
import RoleGrantsService from './RoleGrantsService'

@Module({
  imports: [ProfilesModule, TypeOrmModule.forFeature([RoleGrant])],
  providers: [RolesService, RoleGrantResolvers, RoleGrantsService],
  exports: [RolesService, RoleGrantsService],
})
export class AuthzModule {}

export default AuthzModule
