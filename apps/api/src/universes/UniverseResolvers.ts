import {PrismaClient} from '@prisma/client'
import {injectable} from 'tsyringe'

import {getUsername} from '../users/UserUtils'
import {includeFromSelections} from '../utils/Prisma'
import {getOffset, paginateResponse} from '../utils/Pagination'
import {Query, Mutation, Resolvers} from '../utils/GraphQL'
import UniverseAuthz from './UniverseAuthz'
import {
  IncludeAll,
  fromOrderByInput,
  fromUniverseCondition,
  fromUniverseInput,
} from './UniverseUtils'

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

  getUniverse: Query<'getUniverse'> = async (
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

  getManyUniverses: Query<'getManyUniverses'> = async (
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

  createUniverse: Mutation<'createUniverse'> = async (
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

  updateUniverse: Mutation<'updateUniverse'> = async (
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

  deleteUniverse: Mutation<'deleteUniverse'> = async (
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

  grantUniverseRoles: Mutation<'grantUniverseRoles'> = async (
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
