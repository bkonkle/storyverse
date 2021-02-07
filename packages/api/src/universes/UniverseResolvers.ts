import {PrismaClient} from '@prisma/client'

import {Resolvers, QueryResolvers, MutationResolvers, Universe} from '../Schema'
import {getUsername, maybeUsername} from '../users/UserUtils'
import {Context} from '../utils/Context'
import {includeFromSelections} from '../utils/DbUtils'
import {NotFoundError} from '../utils/Errors'
import {getOffset, paginateResponse} from '../utils/Pagination'
import Prisma from '../utils/Prisma'
import UniverseAuthz from './UniverseAuthz'
import {
  censor,
  fromOrderByInput,
  fromUniverseCondition,
  fromUniverseInput,
  maybeCensor,
} from './UniverseUtils'

export default class UniverseResolvers {
  private readonly prisma: PrismaClient
  private readonly authz: UniverseAuthz

  constructor(prisma?: PrismaClient, authz?: UniverseAuthz) {
    this.prisma = prisma || Prisma.init()
    this.authz = authz || new UniverseAuthz()
  }

  getResolvers = (): Resolvers => ({
    Query: {
      getUniverse: this.getUniverse,
      getManyUniverses: this.getManyUniverses,
    },
    Mutation: {
      createUniverse: this.createUniverse,
      updateUniverse: this.updateUniverse,
      deleteUniverse: this.deleteUniverse,
    },
  })

  getUniverse: QueryResolvers<Context>['getUniverse'] = async (
    _parent,
    {id},
    context,
    _resolveInfo
  ) => {
    const username = maybeUsername(context)

    return this.prisma.universe
      .findFirst({
        include: {ownerProfile: {include: {user: true}}},
        where: {id},
      })
      .then(maybeCensor(username))
  }

  getManyUniverses: QueryResolvers<Context>['getManyUniverses'] = async (
    _parent,
    args,
    context,
    _resolveInfo
  ) => {
    const username = maybeUsername(context)
    const {where, orderBy, pageSize, page} = args

    const options = {
      where: fromUniverseCondition(where),
      orderBy: fromOrderByInput(orderBy),
    }
    const total = await this.prisma.universe.count(options)
    const profiles = await this.prisma.universe.findMany({
      include: {ownerProfile: {include: {user: true}}},
      ...options,
      ...getOffset(pageSize, page),
    })

    return paginateResponse(profiles.map(censor(username)), {
      total,
      pageSize,
      page,
    })
  }

  createUniverse: MutationResolvers<Context>['createUniverse'] = async (
    _parent,
    {input},
    context,
    resolveInfo
  ) => {
    const username = getUsername(context)

    await this.authz.create(username, input.ownerProfileId)

    const [
      includeOwnerProfile,
      includeOwnerUser,
    ] = includeFromSelections(
      resolveInfo.operation.selectionSet,
      'createUniverse.universe',
      ['ownerProfile', 'ownerProfile.user']
    )

    if (includeOwnerProfile) {
      const universe = await this.prisma.universe.create({
        include: {ownerProfile: {include: {user: includeOwnerUser}}},
        data: {
          ...input,
          ownerProfileId: undefined,
          ownerProfile: {
            connect: {id: input.ownerProfileId},
          },
        },
      })

      return {universe}
    }

    const universe = await this.prisma.universe.create({
      data: input,
    })

    return {universe: universe as Universe}
  }

  updateUniverse: MutationResolvers<Context>['updateUniverse'] = async (
    _parent,
    {id, input},
    context,
    resolveInfo
  ) => {
    const username = getUsername(context)
    const existing = await this.authz.update(username, id)

    const [
      includeOwnerProfile,
      includeOwnerUser,
    ] = includeFromSelections(
      resolveInfo.operation.selectionSet,
      'updateUniverse.universe',
      ['ownerProfile', 'ownerProfile.user']
    )

    console.log(`>- includeOwnerProfile ->`, includeOwnerProfile)
    console.log(`>- includeOwnerUser ->`, includeOwnerUser)

    if (includeOwnerProfile) {
      const data = input.ownerProfileId
        ? {
            ...input,
            ownerProfileId: undefined,
            ownerProfile: {
              connect: {id: existing.ownerProfile.id},
            },
          }
        : input

      const universe = await this.prisma.universe.update({
        include: {ownerProfile: {include: {user: includeOwnerUser}}},
        where: {id},
        data: fromUniverseInput(data),
      })

      return {universe}
    }

    const universe = await this.prisma.universe.update({
      where: {id},
      data: fromUniverseInput(input),
    })

    return {universe: universe as Universe}
  }

  deleteUniverse: MutationResolvers<Context>['deleteUniverse'] = async (
    _parent,
    {id},
    context,
    resolveInfo
  ) => {
    const username = getUsername(context)
    await this.authz.remove(username, id)

    const [
      includeOwnerProfile,
      includeOwnerUser,
    ] = includeFromSelections(
      resolveInfo.operation.selectionSet,
      'updateUniverse.universe',
      ['ownerProfile', 'ownerProfile.user']
    )

    if (includeOwnerProfile) {
      const universe = await this.prisma.universe.delete({
        include: {ownerProfile: {include: {user: includeOwnerUser}}},
        where: {id},
      })

      return {universe}
    }

    const universe = await this.prisma.universe.delete({
      where: {id},
    })

    return {universe: universe as Universe}
  }

  private getExisting = async (id: string) => {
    const existing = await this.prisma.universe.findFirst({
      include: {ownerProfile: true},
      where: {id},
    })

    if (!existing) {
      throw new NotFoundError('Not found')
    }

    return existing
  }
}
