import {registry} from 'tsyringe'

import {useClass, useResolvers} from '@storyverse/api/utils'

import ProfileAuthz from './ProfileAuthz'
import ProfileResolvers from './ProfileResolvers'

@registry([useClass(ProfileAuthz), useResolvers(ProfileResolvers)])
export default class ProfileModule {}
