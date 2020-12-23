import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'

import Profile from '../profiles/Profile.entity'
import Universe from './Universe.entity'
import * as ProfileUtils from '../profiles/ProfileUtils'

export const isAuthorized = (universe: Universe, username?: string) => {
  if (username && username === universe.ownerProfile.user.username) {
    return true
  }

  return false
}

export const authorize = (username?: string) => (universe?: Universe) => {
  if (!universe) {
    throw new NotFoundException()
  }

  if (!isAuthorized(universe, username)) {
    throw new ForbiddenException()
  }

  return universe
}

export const authorizeCreate = (username: string) => (profile?: Profile) => {
  if (!profile) {
    throw new BadRequestException(
      'The specified owned-by `Profile` was not found.'
    )
  }

  if (username !== profile.user.username) {
    throw new ForbiddenException()
  }

  return profile
}

export type CensoredUniverse = Omit<Universe, 'ownerProfile'> & {
  ownerProfile: ProfileUtils.CensoredProfile
}

export const censor = (username?: string) => (
  universe: Universe
): CensoredUniverse => {
  if (isAuthorized(universe, username)) {
    return universe
  }

  return {
    ...universe,
    ownerProfile: ProfileUtils.censor(username)(universe.ownerProfile),
  }
}

export const maybeCensor = (username?: string) => (universe?: Universe) => {
  if (!universe) {
    return
  }

  return censor(username)(universe)
}
