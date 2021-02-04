import {Profile, Universe, User} from '@prisma/client'
import {Subject} from '../authorization/AuthzService'

export const TABLE_NAME = 'Universe'

export const isOwner = (
  universe: Universe & {ownerProfile: Profile & {user: User}},
  username?: string
) => username && username === universe.ownerProfile.user.username

export const subject = (id: string): Subject => ({
  table: TABLE_NAME,
  id,
})
