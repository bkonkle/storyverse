import {PrismaClient} from '@prisma/client'
import {injectable} from 'tsyringe'

import {QueryResolvers, MutationResolvers} from '@storyverse/graphql/ApiSchema'

import {getUsername} from '../users/UserUtils'
import {Context} from '../utils/Context'
import {includeFromSelections} from '../utils/Prisma'
import {getOffset, paginateResponse} from '../utils/Pagination'
import SeriesAuthz from './SeriesAuthz'
import {
  IncludeAll,
  fromOrderByInput,
  fromSeriesCondition,
  fromSeriesInput,
} from './SeriesUtils'
import {Resolvers} from '../utils/GraphQL'

@injectable()
export default class SeriesResolvers implements Resolvers {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly authz: SeriesAuthz
  ) {}

  getAll = () => ({
    Query: {
      getSeries: this.getSeries,
      getManySeries: this.getManySeries,
    },
    Mutation: {
      createSeries: this.createSeries,
      updateSeries: this.updateSeries,
      deleteSeries: this.deleteSeries,
    },
  })

  getSeries: QueryResolvers<Context>['getSeries'] = async (
    _parent,
    {id},
    _context,
    resolveInfo
  ) => {
    const include = includeFromSelections(
      resolveInfo.operation.selectionSet,
      'getSeries'
    ) as IncludeAll

    return this.prisma.series.findFirst({
      include,
      where: {id},
    })
  }

  getManySeries: QueryResolvers<Context>['getManySeries'] = async (
    _parent,
    args,
    _context,
    resolveInfo
  ) => {
    const {where, orderBy, pageSize, page} = args

    const options = {
      where: fromSeriesCondition(where),
      orderBy: fromOrderByInput(orderBy),
    }
    const total = await this.prisma.series.count(options)

    const include = includeFromSelections(
      resolveInfo.operation.selectionSet,
      'getManySeries.data'
    ) as IncludeAll

    const series = await this.prisma.series.findMany({
      include,
      ...options,
      ...getOffset(pageSize, page),
    })

    return paginateResponse(series, {
      total,
      pageSize,
      page,
    })
  }

  createSeries: MutationResolvers<Context>['createSeries'] = async (
    _parent,
    {input},
    context,
    resolveInfo
  ) => {
    const username = getUsername(context)

    await this.authz.create(username, input.universeId)

    const include = includeFromSelections(
      resolveInfo.operation.selectionSet,
      'createSeries.series'
    ) as IncludeAll

    const series = await this.prisma.series.create({
      include,
      data: {
        ...input,
        universeId: undefined,
        universe: {
          connect: {id: input.universeId},
        },
      },
    })

    return {series}
  }

  updateSeries: MutationResolvers<Context>['updateSeries'] = async (
    _parent,
    {id, input},
    context,
    resolveInfo
  ) => {
    const username = getUsername(context)
    await this.authz.update(username, id)

    const include = includeFromSelections(
      resolveInfo.operation.selectionSet,
      'updateSeries.series'
    ) as IncludeAll

    const series = await this.prisma.series.update({
      include,
      where: {id},
      data: fromSeriesInput(input),
    })

    return {series}
  }

  deleteSeries: MutationResolvers<Context>['deleteSeries'] = async (
    _parent,
    {id},
    context,
    resolveInfo
  ) => {
    const username = getUsername(context)
    await this.authz.delete(username, id)

    const include = includeFromSelections(
      resolveInfo.operation.selectionSet,
      'deleteSeries.series'
    ) as IncludeAll

    const series = await this.prisma.series.delete({
      include,
      where: {id},
    })

    return {series}
  }
}
