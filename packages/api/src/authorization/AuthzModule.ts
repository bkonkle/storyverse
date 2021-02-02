import {DynamicModule, Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import ProfilesModule from '../profiles/ProfilesModule'

import RoleGrant from './RoleGrant.entity'
import registry, {RolesRegistry} from './RolesRegistry'
import RoleGrantResolvers from './RoleGrantResolvers'
import RoleGrantsService from './RoleGrantsService'
import {Permission, Role} from './Roles'

export interface AuthzModuleOptions {
  roles?: Role[]
  permissions?: Permission[]
}

@Module({
  imports: [ProfilesModule, TypeOrmModule.forFeature([RoleGrant])],
  providers: [
    {
      provide: RolesRegistry,
      useValue: registry,
    },
    RoleGrantResolvers,
    RoleGrantsService,
  ],
  exports: [RoleGrantsService],
})
export class AuthzModule {
  /**
   * A dynamic module helper method that registers new roles and permissions by side-effect before
   * returning the Module definition.
   */
  static register({
    roles,
    permissions,
  }: AuthzModuleOptions = {}): DynamicModule {
    if (permissions) {
      registry.registerPermissions(permissions)
    }
    if (roles) {
      registry.registerRoles(roles)
    }

    return {
      module: AuthzModule,
      imports: [ProfilesModule, TypeOrmModule.forFeature([RoleGrant])],
      providers: [
        {
          provide: RolesRegistry,
          useValue: registry,
        },
        RoleGrantResolvers,
        RoleGrantsService,
      ],
      exports: [RoleGrantsService],
    }
  }
}

export default AuthzModule
