import {PrismaClient} from '@prisma/client'

import {Resolvers, QueryResolvers, MutationResolvers} from '../Schema'
import {getUsername, maybeUsername} from '../users/UserUtils'
import {Context} from '../utils/Context'
import Prisma, {includeFromSelections} from '../utils/Prisma'
import {getOffset, paginateResponse} from '../utils/Pagination'
import UniverseAuthz from './UniverseAuthz'
import {
  IncludeAll,
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

    const include = includeFromSelections(
      resolveInfo.operation.selectionSet,
      'createUniverse.universe'
    ) as IncludeAll

    const universe = await this.prisma.universe.create({
      include,
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

  updateUniverse: MutationResolvers<Context>['updateUniverse'] = async (
    _parent,
    {id, input},
    context,
    resolveInfo
  ) => {
    const username = getUsername(context)
    await this.authz.update(username, id)

    const include = includeFromSelections(
      resolveInfo.operation.selectionSet,
      'updateUniverse.universe'
    ) as IncludeAll

    const universe = await this.prisma.universe.update({
      include,
      where: {id},
      data: fromUniverseInput(input),
    })

    return {universe}
  }

  deleteUniverse: MutationResolvers<Context>['deleteUniverse'] = async (
    _parent,
    {id},
    context,
    resolveInfo
  ) => {
    const username = getUsername(context)
    await this.authz.delete(username, id)

    const include = includeFromSelections(
      resolveInfo.operation.selectionSet,
      'deleteUniverse.universe'
    ) as IncludeAll

    const universe = await this.prisma.universe.delete({
      include,
      where: {id},
    })

    return {universe}
  }
}
