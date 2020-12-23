import {omit} from 'lodash'
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'

import Profile from './Profile.entity'
import User from '../users/User.entity'

export const isAuthorized = (profile: Profile, username?: string) => {
  if (username && username === profile.user.username) {
    return true
  }

  return false
}

export const authorize = (username?: string) => (profile?: Profile) => {
  if (!profile) {
    throw new NotFoundException()
  }

  if (!isAuthorized(profile, username)) {
    throw new ForbiddenException()
  }

  return profile
}

export const authorizeCreate = (username: string) => (user?: User) => {
  if (!user) {
    throw new BadRequestException(
      'An existing User must be found or valid UserInput must be provided.'
    )
  }

  if (username !== user.username) {
    throw new ForbiddenException()
  }

  return user
}

export const censor = (username?: string) => (profile: Profile) => {
  if (isAuthorized(profile, username)) {
    return profile
  }

  return omit(profile, ['email', 'userId', 'user'])
}

export const maybeCensor = (username?: string) => (profile?: Profile) => {
  if (!profile) {
    return
  }

  return censor(username)(profile)
}
