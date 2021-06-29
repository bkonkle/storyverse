import {registry} from 'tsyringe'

import {useClass, useRegistry, useResolvers} from '@storyverse/api/utils'

import {AuthzModule} from '../authz'
import StoryAuthz from './StoryAuthz'
import StoryResolvers from './StoryResolvers'

@registry([
  useRegistry(AuthzModule),
  useClass(StoryAuthz),
  useResolvers(StoryResolvers),
])
export default class StoryModule {}
