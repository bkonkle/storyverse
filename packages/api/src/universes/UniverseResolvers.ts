import {Resolver, Query, Args, Mutation} from '@nestjs/graphql'

import {Universe, UniversesPage, MutateUniverseResult} from '../Schema'
import {fromOrderBy} from '../lib/resolvers'
import UniversesService from './UniversesService'
import GetUniverseArgs from './data/GetUniverseArgs'
import GetManyUniversesArgs from './data/GetManyUniversesArgs'
import CreateUniverseArgs from './data/CreateUniverseArgs'
import UpdateUniverseArgs from './data/UpdateUniverseArgs'
import DeleteUniverseArgs from './data/DeleteUniverseArgs'

@Resolver('Universe')
export class UniverseResolvers {
  constructor(private readonly service: UniversesService) {}

  @Query()
  async getUniverse(
    @Args() args: GetUniverseArgs
  ): Promise<Universe | undefined> {
    const {id} = args

    return this.service.findOne({where: {id}})
  }

  @Query()
  async getManyUniverses(
    @Args() args: GetManyUniversesArgs
  ): Promise<UniversesPage> {
    const {where, orderBy, pageSize, page} = args

    return this.service.find({
      where,
      order: fromOrderBy(orderBy),
      pageSize,
      page,
    })
  }

  @Mutation()
  async createUniverse(
    @Args() args: CreateUniverseArgs
  ): Promise<MutateUniverseResult> {
    const {input} = args

    const universe = await this.service.create(input)

    return {universe}
  }

  @Mutation()
  async updateUniverse(
    @Args() args: UpdateUniverseArgs
  ): Promise<MutateUniverseResult> {
    const {id, input} = args

    const universe = await this.service.update(id, input)

    return {universe}
  }

  @Mutation()
  async deleteUniverse(
    @Args() args: DeleteUniverseArgs
  ): Promise<MutateUniverseResult> {
    const {id} = args

    await this.service.delete(id)

    return {}
  }
}
