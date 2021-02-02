import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'

import Profile from '../profiles/Profile.entity'
import UniverseEntity from './Universe.entity'
import * as ProfileUtils from '../profiles/ProfileUtils'

export namespace Authz {
  export const isAuthorized = (universe: UniverseEntity, username?: string) => {
    if (username && username === universe.ownerProfile.user.username) {
      return true
    }

    return false
  }

  export const create = (username: string) => (profile?: Profile) => {
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

  export const update = (username?: string) => (universe?: UniverseEntity) => {
    if (!universe) {
      throw new NotFoundException()
    }

    if (!isAuthorized(universe, username)) {
      throw new ForbiddenException()
    }

    return universe
  }

  export const remove = update
}

export namespace Censored {
  export type Universe = Omit<UniverseEntity, 'ownerProfile'> & {
    ownerProfile: ProfileUtils.CensoredProfile
  }

  export const censor = (username?: string) => (
    universe: UniverseEntity
  ): Universe => {
    if (Authz.isAuthorized(universe, username)) {
      return universe
    }

    return {
      ...universe,
      ownerProfile: ProfileUtils.censor(username)(universe.ownerProfile),
    }
  }

  export const maybe = (username?: string) => (universe?: UniverseEntity) => {
    if (!universe) {
      return
    }

    return censor(username)(universe)
  }
}
