import {camelCase} from 'lodash'
import {Prisma, Profile, Universe, User} from '@prisma/client'

import * as ProfileUtils from '../profiles/ProfileUtils'
import {Subject} from '../authorization/AuthzService'
import {
  UniverseCondition,
  UniversesOrderBy,
  UpdateUniverseInput,
} from '../Schema'

export const TABLE_NAME = 'Universe'

export interface UniverseWithAuthInfo extends Universe {
  ownerProfile: Profile & {
    user: User
  }
}

export const isOwner = (
  universe: UniverseWithAuthInfo,
  username?: string | null
) => username && username === universe.ownerProfile.user.username

export const subject = (id: string): Subject => ({
  table: TABLE_NAME,
  id,
})

export type CensoredUniverse = Omit<UniverseWithAuthInfo, 'ownerProfile'> & {
  ownerProfile: ProfileUtils.CensoredProfile
}

/**
 * Censor details about the ownerProfile if unauthorized.
 */
export const censor = (username?: string | null) => (
  universe: UniverseWithAuthInfo
): CensoredUniverse => {
  if (isOwner(universe, username)) {
    return universe
  }

  return {
    ...universe,
    ownerProfile: ProfileUtils.censor(username)(universe.ownerProfile),
  }
}

/**
 * Censor details about the ownerProfile is unauthorized, handling absent universes.
 */
export const maybeCensor = (username?: string | null) => (
  universe?: UniverseWithAuthInfo | null
): CensoredUniverse | null => {
  if (!universe) {
    return null
  }

  return censor(username)(universe)
}

/**
 * These required fields cannot be set to `null`, they can only be `undefined` in order for Prisma
 * to ignore them. Force them to `undefined` if they are `null`.
 */
const requiredFields = [
  'id',
  'createdAt',
  'updatedAt',
  'name',
  'description',
  'ownerProfile',
  'ownerProfileId',
  'series',
] as const

export const fromUniverseCondition = (
  where?: UniverseCondition | null
): Prisma.UniverseWhereInput | undefined => {
  if (!where) {
    return undefined
  }

  // Convert any `null`s in required fields to `undefined`s, for compatibility with Prisma
  return requiredFields.reduce(
    (memo, field) => ({...memo, [field]: memo[field] || undefined}),
    where as Prisma.UniverseWhereInput
  )
}

export const fromUniverseInput = (
  input: UpdateUniverseInput
): Prisma.UniverseUpdateInput => {
  // Convert any `null`s in required fields to `undefined`s, for compatibility with Prisma
  return requiredFields.reduce((memo, field) => {
    if (field === 'ownerProfileId') {
      const id = (memo as UpdateUniverseInput).ownerProfileId || undefined
      if (id) {
        return {...memo, user: {connect: {id}}}
      }

      return memo
    }

    return {...memo, [field]: memo[field] || undefined}
  }, input as Prisma.UniverseUpdateInput)
}

export const fromOrderByInput = (
  orderBy?: UniversesOrderBy[] | null
): Prisma.UniverseOrderByInput | undefined => {
  return orderBy?.reduce((memo, order) => {
    const index = order.lastIndexOf('_')
    const [field, direction] = [
      camelCase(order.substr(0, index)),
      order.substr(index + 1),
    ]

    return {...memo, [field]: direction}
  }, {})
}
