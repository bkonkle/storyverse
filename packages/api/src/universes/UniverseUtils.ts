import {Subject, SubjectInput} from '../authorization/RoleGrantsService'
import * as ProfileUtils from '../profiles/ProfileUtils'
import Universe, {TABLE_NAME} from './Universe.entity'

export const isOwner = (universe: Universe, username?: string) =>
  username && username === universe.ownerProfile.user.username

export const subject = (id: string): Subject => ({
  table: TABLE_NAME,
  id,
})

export const subjectInput = (id: string): SubjectInput => ({
  subjectTable: TABLE_NAME,
  subjectId: id,
})

export type CensoredUniverse = Omit<Universe, 'ownerProfile'> & {
  ownerProfile: ProfileUtils.CensoredProfile
}

export const censor = (username?: string) => (
  universe: Universe
): CensoredUniverse => {
  if (isOwner(universe, username)) {
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
