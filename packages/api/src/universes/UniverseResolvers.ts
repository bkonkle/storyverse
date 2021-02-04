import {PrismaClient} from '@prisma/client'
import {AuthenticationError} from 'apollo-server-core'
import {get} from 'lodash'

import {Resolvers, QueryResolvers, MutationResolvers, Universe} from '../Schema'
import {Context} from '../utils/Context'
import {includeFromSelections} from '../utils/DbUtils'
import Prisma from '../utils/Prisma'
import UniverseAuthz from './UniverseAuthz'

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
    args,
    _context,
    _resolveInfo
  ) => {
    console.log(`>- UniverseResolvers.getUniverse -<`, args)

    return {} as Universe
  }

  getManyUniverses: QueryResolvers<Context>['getManyUniverses'] = async (
    _parent,
    args,
    _context,
    _resolveInfo
  ) => {
    console.log('>- UniverseResolvers.getManyUniverses -<', args)

    return {
      data: [] as Universe[],
      count: 0,
      total: 0,
      page: 0,
      pageCount: 0,
    }
  }

  createUniverse: MutationResolvers<Context>['createUniverse'] = async (
    _parent,
    {input},
    {req: {user}},
    resolveInfo
  ) => {
    if (!user) {
      throw new AuthenticationError('Authentication required')
    }
    const {sub: username} = user

    await this.authz.create(username, input.ownerProfileId)

    const include = get(
      includeFromSelections(resolveInfo.operation.selectionSet),
      'createUniverse.universe'
    )
    const includeOwnerProfile = get(include, 'ownerProfile') === true || false

    const universe = await this.prisma.universe.create({
      include: {
        ownerProfile: includeOwnerProfile,
      },
      data: includeOwnerProfile
        ? {
            ...input,
            ownerProfileId: undefined,
            ownerProfile: {
              connect: {id: input.ownerProfileId},
            },
          }
        : input,
    })

    return {universe}
  }

  updateUniverse: MutationResolvers<Context>['updateUniverse'] = async (
    _parent,
    args,
    _context,
    _resolveInfo
  ) => {
    console.log('>- UniverseResolvers.updateUniverse -<', args)

    return {}
  }

  deleteUniverse: MutationResolvers<Context>['deleteUniverse'] = async (
    _parent,
    args,
    _context,
    _resolveInfo
  ) => {
    console.log('>- UniverseResolvers.deleteUniverse -<', args)

    return {}
  }
}
