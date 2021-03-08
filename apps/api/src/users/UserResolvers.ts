import {PrismaClient} from '@prisma/client'

import {Resolvers, QueryResolvers, MutationResolvers} from '../Schema'
import {Context} from '../utils/Context'
import {NotFoundError} from '../utils/Errors'
import Prisma from '../utils/Prisma'
import {getUsername, requireMatchingUsername} from './UserUtils'

export default class UserResolvers {
  private readonly prisma: PrismaClient

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || Prisma.init()
  }

  getResolvers = (): Resolvers => ({
    Query: {
      getCurrentUser: this.getCurrentUser,
    },
    Mutation: {
      createUser: this.createUser,
      updateCurrentUser: this.updateCurrentUser,
      getOrCreateCurrentUser: this.getOrCreateCurrentUser,
    },
  })

  getCurrentUser: QueryResolvers<Context>['getCurrentUser'] = async (
    _parent,
    _args,
    context,
    _resolveInfo
  ) => {
    const username = getUsername(context)

    return this.prisma.user.findFirst({
      include: {profile: true},
      where: {username},
    })
  }

  createUser: MutationResolvers<Context>['createUser'] = async (
    _parent,
    {input},
    context,
    _resolveInfo
  ) => {
    requireMatchingUsername(context, input.username)

    const user = await this.prisma.user.create({
      include: {profile: true},
      data: {
        ...input,
        profile: input.profile
          ? {
              create: input.profile,
            }
          : undefined,
      },
    })

    return {user}
  }

  getOrCreateCurrentUser: MutationResolvers<Context>['getOrCreateCurrentUser'] = async (
    _parent,
    {input},
    context,
    _resolveInfo
  ) => {
    requireMatchingUsername(context, input.username)

    const existing = await this.prisma.user.findFirst({
      include: {profile: true},
      where: {username: input.username},
    })
    if (existing) {
      return {user: existing}
    }

    const user = await this.prisma.user.create({
      include: {profile: true},
      data: {
        ...input,
        profile: input.profile
          ? {
              create: input.profile,
            }
          : undefined,
      },
    })

    return {user}
  }

  updateCurrentUser: MutationResolvers<Context>['updateCurrentUser'] = async (
    _parent,
    {input},
    context,
    _resolveInfo
  ) => {
    const username = getUsername(context)

    const existing = await this.prisma.user.findFirst({
      where: {username},
    })
    if (!existing) {
      throw new NotFoundError('Not found')
    }

    const user = await this.prisma.user.update({
      include: {profile: true},
      where: {id: existing.id},
      data: {
        username: input.username || undefined,
        isActive: input.isActive === null ? undefined : input.isActive,
      },
    })

    return {user}
  }
}
