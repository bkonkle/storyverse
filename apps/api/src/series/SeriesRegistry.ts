import {registry} from 'tsyringe'

import {AuthzRegistry, usePermissions, useRoles} from '../authz'
import {useClass, useRegistry} from '../utils/Injection'
import {useResolvers} from '../utils/GraphQL'
import SeriesAuthz from './SeriesAuthz'
import SeriesResolvers from './SeriesResolvers'
import {permissions, roles} from './SeriesRoles'

@registry([
  ...usePermissions(permissions),
  ...useRoles(roles),
  useRegistry(AuthzRegistry),
  useClass(SeriesAuthz),
  useResolvers(SeriesResolvers),
])
export default class SeriesRegistry {}
