import {Subject, SubjectInput} from '../authorization/RoleGrantsService'
import * as ProfileUtils from '../profiles/ProfileUtils'
import UniverseEntity, {TABLE_NAME} from './Universe.entity'

export const isOwner = (universe: UniverseEntity, username?: string) =>
  username && username === universe.ownerProfile.user.username

export const subject = (id: string): Subject => ({
  table: TABLE_NAME,
  id,
})

export const subjectInput = (id: string): SubjectInput => ({
  subjectTable: TABLE_NAME,
  subjectId: id,
})

export namespace Censored {
  export type Universe = Omit<UniverseEntity, 'ownerProfile'> & {
    ownerProfile: ProfileUtils.CensoredProfile
  }

  export const censor = (username?: string) => (
    universe: UniverseEntity
  ): Universe => {
    if (isOwner(universe, username)) {
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
