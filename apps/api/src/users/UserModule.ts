import {registry} from 'tsyringe'

import {useResolvers} from '@storyverse/api/utils'

import UserResolvers from './UserResolvers'

@registry([useResolvers(UserResolvers)])
export default class UserModule {}
