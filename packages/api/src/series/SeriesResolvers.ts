import {ParseUUIDPipe, UseGuards} from '@nestjs/common'
import {Resolver, Query, Args, Mutation} from '@nestjs/graphql'

import {
  Series,
  SeriesPage,
  MutateSeriesResult,
  CreateSeriesInput,
  QueryGetManySeriesArgs,
  UpdateSeriesInput,
} from '../Schema'
import {fromOrderBy} from '../lib/resolvers'
import {JwtGuard} from '../lib/auth/JwtGuard'
import {AllowAnonymous, UserSub} from '../lib/auth/JwtDecorators'
import SeriesAuthz from './SeriesAuthz'
import SeriesService from './SeriesService'

@Resolver('Series')
@UseGuards(JwtGuard)
export class SeriesResolvers {
  constructor(
    private readonly service: SeriesService,
    private readonly authz: SeriesAuthz
  ) {}

  @Query()
  @AllowAnonymous()
  async getSeries(
    @Args('id', new ParseUUIDPipe()) id: string
  ): Promise<Series | undefined> {
    return this.service.findOne({where: {id}})
  }

  @Query()
  @AllowAnonymous()
  async getManySeries(
    @Args() args: QueryGetManySeriesArgs
  ): Promise<SeriesPage> {
    const {where, orderBy, pageSize, page} = args

    return this.service.find({
      where,
      order: fromOrderBy(orderBy),
      pageSize,
      page,
    })
  }

  @Mutation()
  async createSeries(
    @Args('input') input: CreateSeriesInput,
    @UserSub({require: true}) username: string
  ): Promise<MutateSeriesResult> {
    await this.authz.create(username, input.universeId)

    const series = await this.service.create(input)

    return {series}
  }

  @Mutation()
  async updateSeries(
    @Args('id', new ParseUUIDPipe()) id: string,
    @Args('input') input: UpdateSeriesInput,
    @UserSub({require: true}) username: string
  ): Promise<MutateSeriesResult> {
    await this.authz.update(username, id)

    const series = await this.service.update(id, input)

    return {series}
  }

  @Mutation()
  async deleteSeries(
    @Args('id', new ParseUUIDPipe()) id: string,
    @UserSub({require: true}) username: string
  ): Promise<MutateSeriesResult> {
    const existing = await this.authz.delete(username, id)

    await this.service.delete(id)

    return {series: existing}
  }
}
