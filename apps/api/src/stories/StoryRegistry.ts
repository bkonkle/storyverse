import {registry} from 'tsyringe'

import {AuthzRegistry} from '../authz'
import {useClass, useRegistry} from '../utils/Injection'
import {useResolvers} from '../utils/GraphQL'
import StoryAuthz from './StoryAuthz'
import StoryResolvers from './StoryResolvers'

@registry([
  useRegistry(AuthzRegistry),
  useClass(StoryAuthz),
  useResolvers(StoryResolvers),
])
export default class StoryRegistry {}
