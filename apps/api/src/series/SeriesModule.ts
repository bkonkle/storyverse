import {registry} from 'tsyringe'

import {useClass, useRegistry, useResolvers} from '@storyverse/api/utils'

import {AuthzModule, usePermissions, useRoles} from '../authz'
import SeriesAuthz from './SeriesAuthz'
import SeriesResolvers from './SeriesResolvers'
import {permissions, roles} from './SeriesRoles'

@registry([
  ...usePermissions(permissions),
  ...useRoles(roles),
  useRegistry(AuthzModule),
  useClass(SeriesAuthz),
  useResolvers(SeriesResolvers),
])
export default class SeriesModule {}
