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

export const censoredFields = ['email'] as const
export type CensoredProfile = Omit<Profile, typeof censoredFields[number]>

export const censor = (username?: string) => (
  profile: Profile
): CensoredProfile => {
  if (isAuthorized(profile, username)) {
    return profile
  }

  return omit(profile, censoredFields)
}

export const maybeCensor = (username?: string) => (
  profile?: Profile
): CensoredProfile | undefined => {
  if (!profile) {
    return
  }

  return censor(username)(profile)
}
