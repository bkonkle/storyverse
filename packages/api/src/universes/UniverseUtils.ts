import {Profile, Universe, User} from '@prisma/client'

export const isOwner = (
  universe: Universe & {ownerProfile: Profile & {user: User}},
  username?: string
) => username && username === universe.ownerProfile.user.username
