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
import UniversesService from './UniversesService'
import ProfilesService from '../profiles/ProfilesService'
import {JwtGuard} from '../lib/auth/JwtGuard'
import {AllowAnonymous, UserSub} from '../lib/auth/JwtDecorators'
import {authorize, authorizeCreate, censor, maybeCensor} from './UniverseUtils'

@Resolver('Universe')
@UseGuards(JwtGuard)
export class UniverseResolvers {
  constructor(
    private readonly service: UniversesService,
    private readonly profiles: ProfilesService
  ) {}

  @Query()
  @AllowAnonymous()
  async getUniverse(
    @Args('id', new ParseUUIDPipe()) id: string,
    @UserSub() username?: string
  ): Promise<Universe | undefined> {
    return this.service.findOne({where: {id}}).then(maybeCensor(username))
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
      data: universes.data.map(censor(username)),
    }
  }

  @Mutation()
  async createUniverse(
    @Args('input') input: CreateUniverseInput,
    @UserSub({require: true}) username: string
  ): Promise<MutateUniverseResult> {
    await this.profiles
      .findOne({
        where: {id: input.ownerProfileId},
      })
      .then(authorizeCreate(username))

    const universe = await this.service.create(input)

    return {universe}
  }

  @Mutation()
  async updateUniverse(
    @Args('id', new ParseUUIDPipe()) id: string,
    @Args('input') input: UpdateUniverseInput,
    @UserSub({require: true}) username: string
  ): Promise<MutateUniverseResult> {
    await this.service.findOne({where: {id}}).then(authorize(username))

    const universe = await this.service.update(id, input)

    return {universe}
  }

  @Mutation()
  async deleteUniverse(
    @Args('id', new ParseUUIDPipe()) id: string,
    @UserSub({require: true}) username: string
  ): Promise<MutateUniverseResult> {
    const existing = await this.service
      .findOne({where: {id}})
      .then(authorize(username))

    await this.service.delete(id)

    return {universe: existing}
  }
}
