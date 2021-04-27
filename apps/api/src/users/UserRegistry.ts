import {registry} from 'tsyringe'

import {useResolvers} from '../utils/GraphQL'
import UserResolvers from './UserResolvers'

@registry([useResolvers(UserResolvers)])
export default class UserRegistry {}
