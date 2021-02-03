import {Resolvers, QueryResolvers, MutationResolvers, Universe} from '../Schema'
import {Context} from '../utils/Context'
import UniversesService from './UniversesService'

export default class UniverseResolvers {
  private readonly service: UniversesService

  constructor(service?: UniversesService) {
    this.service = service || new UniversesService()
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
    _context,
    _resolveInfo
  ) => {
    // console.log(
    //   `>- resolveInfo.operation.selectionSet.selections ->`,
    //   resolveInfo.operation.selectionSet.selections
    // )
    const universe = await this.service.createUniverse(input)

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
