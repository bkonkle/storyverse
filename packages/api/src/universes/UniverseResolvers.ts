import {ParseUUIDPipe, UseGuards} from '@nestjs/common'
import {Resolver, Query, Args, Mutation} from '@nestjs/graphql'

import {
  Universe,
  UniversesPage,
  MutateUniverseResult,
  CreateUniverseInput,
  QueryGetManyUniversesArgs,
  UpdateUniverseInput,
} from '../Schema'
import {fromOrderBy} from '../lib/resolvers'
import {JwtGuard} from '../lib/auth/JwtGuard'
import {AllowAnonymous, UserSub} from '../lib/auth/JwtDecorators'
import UniverseAuthz from './UniverseAuthz'
import UniversesService from './UniversesService'
import {Censored} from './UniverseUtils'

@Resolver('Universe')
@UseGuards(JwtGuard)
export class UniverseResolvers {
  constructor(
    private readonly service: UniversesService,
    private readonly authz: UniverseAuthz
  ) {}

  @Query()
  @AllowAnonymous()
  async getUniverse(
    @Args('id', new ParseUUIDPipe()) id: string,
    @UserSub() username?: string
  ): Promise<Universe | undefined> {
    return this.service.findOne({where: {id}}).then(Censored.maybe(username))
  }

  @Query()
  @AllowAnonymous()
  async getManyUniverses(
    @Args() args: QueryGetManyUniversesArgs,
    @UserSub() username?: string
  ): Promise<UniversesPage> {
    const {where, orderBy, pageSize, page} = args

    const universes = await this.service.find({
      where,
      order: fromOrderBy(orderBy),
      pageSize,
      page,
    })

    return {
      ...universes,
      data: universes.data.map(Censored.censor(username)),
    }
  }

  @Mutation()
  async createUniverse(
    @Args('input') input: CreateUniverseInput,
    @UserSub({require: true}) username: string
  ): Promise<MutateUniverseResult> {
    await this.authz.create(username, input.ownerProfileId)

    const universe = await this.service.create(input)

    return {universe}
  }

  @Mutation()
  async updateUniverse(
    @Args('id', new ParseUUIDPipe()) id: string,
    @Args('input') input: UpdateUniverseInput,
    @UserSub({require: true}) username: string
  ): Promise<MutateUniverseResult> {
    await this.authz.update(username, id)

    const universe = await this.service.update(id, input)

    return {universe}
  }

  @Mutation()
  async deleteUniverse(
    @Args('id', new ParseUUIDPipe()) id: string,
    @UserSub({require: true}) username: string
  ): Promise<MutateUniverseResult> {
    const existing = await this.authz.remove(username, id)

    await this.service.delete(id)

    return {universe: existing}
  }
}
