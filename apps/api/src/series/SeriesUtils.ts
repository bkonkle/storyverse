import {camelCase} from 'lodash'
import {Prisma} from '@prisma/client'

import {Subject} from '../authz/AuthzService'
import * as UniverseUtils from '../universes/UniverseUtils'
import {SeriesCondition, SeriesOrderBy, UpdateSeriesInput} from '../Schema'

export type IncludeAll = {
  universe: {
    include: UniverseUtils.IncludeAll
  }
}

export const TABLE_NAME = 'Series'

export interface SeriesSubject extends Subject {
  readonly __tag__: 'Series'
}

export const getSubject = (id: string): SeriesSubject => ({
  __tag__: 'Series',
  table: TABLE_NAME,
  id,
})

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
  'universe',
  'universeId',
] as const

export const fromSeriesCondition = (
  where?: SeriesCondition | null
): Prisma.SeriesWhereInput | undefined => {
  if (!where) {
    return undefined
  }

  // Convert any `null`s in required fields to `undefined`s, for compatibility with Prisma
  return requiredFields.reduce(
    (memo, field) => ({...memo, [field]: memo[field] || undefined}),
    where as Prisma.SeriesWhereInput
  )
}

export const fromSeriesInput = (
  input: UpdateSeriesInput
): Prisma.SeriesUpdateInput => {
  // Convert any `null`s in required fields to `undefined`s, for compatibility with Prisma
  return requiredFields.reduce((memo, field) => {
    if (field === 'universeId') {
      const id = (memo as UpdateSeriesInput).universeId || undefined
      if (id) {
        return {...memo, user: {connect: {id}}}
      }

      return memo
    }

    return {...memo, [field]: memo[field] || undefined}
  }, input as Prisma.SeriesUpdateInput)
}

export const fromOrderByInput = (
  orderBy?: SeriesOrderBy[] | null
): Prisma.SeriesOrderByInput | undefined => {
  return orderBy?.reduce((memo, order) => {
    const index = order.lastIndexOf('_')
    const [field, direction] = [
      camelCase(order.substr(0, index)),
      order.substr(index + 1),
    ]

    return {...memo, [field]: direction}
  }, {})
}
