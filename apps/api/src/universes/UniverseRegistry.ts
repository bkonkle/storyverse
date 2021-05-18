import {registry} from 'tsyringe'

import {useClass, useRegistry, useResolvers} from '@storyverse/server/utils'

import {AuthzRegistry, usePermissions, useRoles} from '../authz'
import UniverseAuthz from './UniverseAuthz'
import UniverseResolvers from './UniverseResolvers'
import {permissions, roles} from './UniverseRoles'

@registry([
  ...usePermissions(permissions),
  ...useRoles(roles),
  useRegistry(AuthzRegistry),
  useClass(UniverseAuthz),
  useResolvers(UniverseResolvers),
])
export default class UniverseRegistry {}
