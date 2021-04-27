import {PrismaClient} from '@prisma/client'
import {injectable} from 'tsyringe'

import {QueryResolvers, MutationResolvers} from '@storyverse/graphql/ApiSchema'

import {getUsername} from '../users/UserUtils'
import {Context} from '../utils/Context'
import {includeFromSelections} from '../utils/Prisma'
import {getOffset, paginateResponse} from '../utils/Pagination'
import UniverseAuthz from './UniverseAuthz'
import {
  IncludeAll,
  fromOrderByInput,
  fromUniverseCondition,
  fromUniverseInput,
} from './UniverseUtils'
import {Resolvers} from '../utils/GraphQL'

@injectable()
export default class UniverseResolvers implements Resolvers {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly authz: UniverseAuthz
  ) {}

  getAll = () => ({
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
    _context,
    _resolveInfo
  ) => {
    return this.prisma.universe.findFirst({
      include: {ownerProfile: {include: {user: true}}},
      where: {id},
    })
  }

  getManyUniverses: QueryResolvers<Context>['getManyUniverses'] = async (
    _parent,
    args,
    _context,
    _resolveInfo
  ) => {
    const {where, orderBy, pageSize, page} = args

    const options = {
      where: fromUniverseCondition(where),
      orderBy: fromOrderByInput(orderBy),
    }
    const total = await this.prisma.universe.count(options)
    const universes = await this.prisma.universe.findMany({
      include: {ownerProfile: {include: {user: true}}},
      ...options,
      ...getOffset(pageSize, page),
    })

    return paginateResponse(universes, {
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

  grantUniverseRoles: MutationResolvers<Context>['grantUniverseRoles'] = async (
    _parent,
    {universeId, profileId, roles},
    context,
    _resolveInfo
  ) => {
    const username = getUsername(context)
    await this.authz.grantRoles(username, universeId, profileId, roles)

    return true
  }
}
