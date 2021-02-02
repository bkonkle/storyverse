import {Resolvers, QueryResolvers, MutationResolvers, Series} from '../Schema'
import {Context} from '../utils/Context'

export default class SeriesResolvers {
  getResolvers = (): Resolvers => ({
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
    args,
    _context,
    _resolveInfo
  ) => {
    console.log(`>- SeriesResolvers.getSeries -<`, args)

    return {} as Series
  }

  getManySeries: QueryResolvers<Context>['getManySeries'] = async (
    _parent,
    args,
    _context,
    _resolveInfo
  ) => {
    console.log('>- SeriesResolvers.getManySeries -<', args)

    return {
      data: [] as Series[],
      count: 0,
      total: 0,
      page: 0,
      pageCount: 0,
    }
  }

  createSeries: MutationResolvers<Context>['createSeries'] = async (
    _parent,
    args,
    _context,
    _resolveInfo
  ) => {
    console.log('>- SeriesResolvers.createSeries -<', args)

    return {}
  }

  updateSeries: MutationResolvers<Context>['updateSeries'] = async (
    _parent,
    args,
    _context,
    _resolveInfo
  ) => {
    console.log('>- SeriesResolvers.updateSeries -<', args)

    return {}
  }

  deleteSeries: MutationResolvers<Context>['deleteSeries'] = async (
    _parent,
    args,
    _context,
    _resolveInfo
  ) => {
    console.log('>- SeriesResolvers.deleteSeries -<', args)

    return {}
  }
}
