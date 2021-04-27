import {registry} from 'tsyringe'

import {AuthzRegistry, usePermissions, useRoles} from '../authz'
import {useClass, useRegistry} from '../utils/Injection'
import {useResolvers} from '../utils/GraphQL'
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
