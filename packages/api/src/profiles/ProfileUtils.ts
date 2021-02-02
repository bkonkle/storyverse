import {omit} from 'lodash'

import Profile, {TABLE_NAME} from './Profile.entity'
import {Subject, SubjectInput} from '../authorization/RoleGrantsService'

export const isOwner = (profile: Profile, username?: string) =>
  username && username === profile.user.username

export const subject = (id: string): Subject => ({
  table: TABLE_NAME,
  id,
})

export const subjectInput = (id: string): SubjectInput => ({
  subjectTable: TABLE_NAME,
  subjectId: id,
})

export const censoredFields = ['email', 'userId', 'user'] as const
export type CensoredProfile = Omit<Profile, typeof censoredFields[number]>

export const censor = (username?: string) => (
  profile: Profile
): CensoredProfile => {
  if (isOwner(profile, username)) {
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
