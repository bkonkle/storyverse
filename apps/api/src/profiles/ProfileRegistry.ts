import {registry} from 'tsyringe'

import {useClass, useResolvers} from '@storyverse/server/utils'

import ProfileAuthz from './ProfileAuthz'
import ProfileResolvers from './ProfileResolvers'

@registry([useClass(ProfileAuthz), useResolvers(ProfileResolvers)])
export default class ProfileRegistry {}
