import {curry} from 'lodash'
import {BadRequestException, ForbiddenException} from '@nestjs/common'

import Profile from '../profiles/Profile.entity'
import User from './User.entity'

export const isAuthorized = (
  user: Pick<User, 'username'>,
  username?: string
) => {
  if (username && username === user.username) {
    return true
  }

  return false
}

export const authorize = curry(
  (username: string | undefined, user: Pick<User, 'username'>) => {
    if (!isAuthorized(user, username)) {
      throw new ForbiddenException()
    }

    return user
  }
)

export const authorizeCreate = (profile?: Profile) => {
  if (!profile) {
    throw new BadRequestException(
      'An existing Profile must be found or valid CreateProfileInput must be provided.'
    )
  }

  // Check to see if this profile is already associated with a user
  if (profile.users.length) {
    throw new ForbiddenException(
      'That Profile is already associated with a User.'
    )
  }

  return profile
}
