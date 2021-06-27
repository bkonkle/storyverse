import {registry} from 'tsyringe'

import {useClass, useRegistry, useResolvers} from '@storyverse/api/utils'

import {AuthzRegistry} from '../authz'
import StoryAuthz from './StoryAuthz'
import StoryResolvers from './StoryResolvers'

@registry([
  useRegistry(AuthzRegistry),
  useClass(StoryAuthz),
  useResolvers(StoryResolvers),
])
export default class StoryRegistry {}
