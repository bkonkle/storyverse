import {registry} from 'tsyringe'

import {useClass} from '../utils/Injection'
import {useResolvers} from '../utils/GraphQL'
import ProfileAuthz from './ProfileAuthz'
import ProfileResolvers from './ProfileResolvers'

@registry([useClass(ProfileAuthz), useResolvers(ProfileResolvers)])
export default class ProfileRegistry {}
