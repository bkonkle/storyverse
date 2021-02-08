import {PrismaClient} from '@prisma/client'
import {Resolvers, QueryResolvers, MutationResolvers} from '../Schema'
import {getUsername, maybeUsername} from '../users/UserUtils'
import {Context} from '../utils/Context'
import Prisma from '../utils/Prisma'
import {getOffset, paginateResponse} from '../utils/Pagination'
import ProfileAuthz from './ProfileAuthz'
import {
  censor,
  fromOrderByInput,
  fromProfileCondition,
  fromProfileInput,
} from './ProfileUtils'

export default class ProfileResolvers {
  private readonly prisma: PrismaClient
  private readonly authz: ProfileAuthz

  constructor(prisma?: PrismaClient, authz?: ProfileAuthz) {
    this.prisma = prisma || Prisma.init()
    this.authz = authz || new ProfileAuthz()
  }

  getResolvers = (): Resolvers => ({
    Query: {
      getProfile: this.getProfile,
      getManyProfiles: this.getManyProfiles,
    },
    Mutation: {
      createProfile: this.createProfile,
      updateProfile: this.updateProfile,
      deleteProfile: this.deleteProfile,
    },
  })

  /**
   * Retrieves a profile by id. Profiles are public, but if the username and token sub don't match,
   * censor the user and email address from the results.
   */
  getProfile: QueryResolvers<Context>['getProfile'] = async (
    _parent,
    {id},
    context,
    _resolveInfo
  ) => {
    const username = maybeUsername(context)

    const profile = await this.prisma.profile.findFirst({
      include: {user: true},
      where: {id},
    })

    if (!profile) {
      return null
    }

    return censor(username, profile)
  }

  /**
   * Lists profiles by various criteria. Profiles are public, but if the username and token sub
   * don't match, censor the user and email address from the results.
   */
  getManyProfiles: QueryResolvers<Context>['getManyProfiles'] = async (
    _parent,
    args,
    context,
    _resolveInfo
  ) => {
    const {where, orderBy, pageSize, page} = args
    const username = maybeUsername(context)

    const options = {
      where: fromProfileCondition(where),
      orderBy: fromOrderByInput(orderBy),
    }
    const total = await this.prisma.profile.count(options)
    const profiles = await this.prisma.profile.findMany({
      include: {user: true},
      ...options,
      ...getOffset(pageSize, page),
    })

    return paginateResponse(profiles.map(censor(username)), {
      total,
      pageSize,
      page,
    })
  }

  /**
   * Create a new Profile for an authenticated user.
   */
  createProfile: MutationResolvers<Context>['createProfile'] = async (
    _parent,
    {input},
    context,
    _resolveInfo
  ) => {
    const username = getUsername(context)
    const user = await this.prisma.user
      .findFirst({where: {id: input.userId}})
      .then(this.authz.create(username))

    const profile = await this.prisma.profile.create({
      include: {user: true},
      data: {
        ...input,
        userId: undefined,
        user: {
          connect: {id: user.id},
        },
      },
    })

    return {profile}
  }

  /**
   * Update an existing Profile for an authorized user.
   */
  updateProfile: MutationResolvers<Context>['updateProfile'] = async (
    _parent,
    {id, input},
    context,
    _resolveInfo
  ) => {
    const username = getUsername(context)
    await this.authz.update(username, id)

    const data = input.userId
      ? {
          ...input,
          userId: undefined,
          user: {
            connect: {id: input.userId},
          },
        }
      : input

    const profile = await this.prisma.profile.update({
      include: {user: true},
      where: {id},
      data: fromProfileInput(data),
    })

    return {profile}
  }

  /**
   * Delete an existing profile for an authorized user.
   */
  deleteProfile: MutationResolvers<Context>['deleteProfile'] = async (
    _parent,
    {id},
    context,
    _resolveInfo
  ) => {
    const username = getUsername(context)
    await this.authz.delete(username, id)

    const profile = await this.prisma.profile.delete({
      include: {user: true},
      where: {id},
    })

    return {profile}
  }
}
