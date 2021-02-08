import {camelCase} from 'lodash'
import {Prisma} from '@prisma/client'

import {Subject} from '../authz/AuthzService'
import * as SeriesUtils from '../series/SeriesUtils'
import {StoryCondition, StoriesOrderBy, UpdateStoryInput} from '../Schema'

export type IncludeAll = {
  series: {
    include: SeriesUtils.IncludeAll
  }
}

export const TABLE_NAME = 'Story'

export const subject = (id: string): Subject => ({
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
  'summary',
  'content',
  'series',
  'seriesId',
] as const

export const fromStoryCondition = (
  where?: StoryCondition | null
): Prisma.StoryWhereInput | undefined => {
  if (!where) {
    return undefined
  }

  // Convert any `null`s in required fields to `undefined`s, for compatibility with Prisma
  return requiredFields.reduce(
    (memo, field) => ({...memo, [field]: memo[field] || undefined}),
    where as Prisma.StoryWhereInput
  )
}

export const fromStoryInput = (
  input: UpdateStoryInput
): Prisma.StoryUpdateInput => {
  // Convert any `null`s in required fields to `undefined`s, for compatibility with Prisma
  return requiredFields.reduce((memo, field) => {
    if (field === 'seriesId') {
      const id = (memo as UpdateStoryInput).seriesId || undefined
      if (id) {
        return {...memo, user: {connect: {id}}}
      }

      return memo
    }

    return {...memo, [field]: memo[field] || undefined}
  }, input as Prisma.StoryUpdateInput)
}

export const fromOrderByInput = (
  orderBy?: StoriesOrderBy[] | null
): Prisma.StoryOrderByInput | undefined => {
  return orderBy?.reduce((memo, order) => {
    const index = order.lastIndexOf('_')
    const [field, direction] = [
      camelCase(order.substr(0, index)),
      order.substr(index + 1),
    ]

    return {...memo, [field]: direction}
  }, {})
}
