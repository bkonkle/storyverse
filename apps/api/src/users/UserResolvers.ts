import {PrismaClient} from '@prisma/client'
import {injectable} from 'tsyringe'

import {Query, Mutation, Resolvers} from '../utils/GraphQL'
import {NotFoundError} from '../utils/Errors'
import {getUsername, requireMatchingUsername} from './UserUtils'

@injectable()
export default class UserResolvers implements Resolvers {
  constructor(private readonly prisma: PrismaClient) {}

  getAll = () => ({
    Query: {
      getCurrentUser: this.getCurrentUser,
    },
    Mutation: {
      createUser: this.createUser,
      updateCurrentUser: this.updateCurrentUser,
      getOrCreateCurrentUser: this.getOrCreateCurrentUser,
    },
  })

  getCurrentUser: Query<'getCurrentUser'> = async (
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

  createUser: Mutation<'createUser'> = async (
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

  getOrCreateCurrentUser: Mutation<'getOrCreateCurrentUser'> = async (
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

  updateCurrentUser: Mutation<'updateCurrentUser'> = async (
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
