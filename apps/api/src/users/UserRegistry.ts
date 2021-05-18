import {registry} from 'tsyringe'

import {useResolvers} from '@storyverse/server/utils'

import UserResolvers from './UserResolvers'

@registry([useResolvers(UserResolvers)])
export default class UserRegistry {}
