import {registry} from 'tsyringe'

import {useClass, useRegistry, useResolvers} from '@storyverse/api/utils'

import {AuthzModule, usePermissions, useRoles} from '../authz'
import UniverseAuthz from './UniverseAuthz'
import UniverseResolvers from './UniverseResolvers'
import {permissions, roles} from './UniverseRoles'

@registry([
  ...usePermissions(permissions),
  ...useRoles(roles),
  useRegistry(AuthzModule),
  useClass(UniverseAuthz),
  useResolvers(UniverseResolvers),
])
export default class UniverseModule {}
