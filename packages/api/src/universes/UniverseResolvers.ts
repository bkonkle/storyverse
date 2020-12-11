import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common'
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
import {UserSub} from '../lib/auth/JwtDecorators'

@Resolver('Universe')
@UseGuards(JwtGuard)
export class UniverseResolvers {
  constructor(
    private readonly service: UniversesService,
    private readonly profiles: ProfilesService
  ) {}

  @Query()
  async getUniverse(
    @Args('id', new ParseUUIDPipe()) id: string
  ): Promise<Universe | undefined> {
    return this.service.findOne({where: {id}})
  }

  @Query()
  async getManyUniverses(
    @Args() args: QueryGetManyUniversesArgs
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
    @Args('input') input: CreateUniverseInput,
    @UserSub({require: true}) username: string
  ): Promise<MutateUniverseResult> {
    const profile = await this.profiles.findOne({
      where: {id: input.ownedByProfileId},
    })
    if (!profile) {
      throw new BadRequestException(
        'The specified owned-by `Profile` was not found.'
      )
    }

    if (username !== profile.user.username) {
      throw new ForbiddenException()
    }

    const universe = await this.service.create(input)

    return {universe}
  }

  @Mutation()
  async updateUniverse(
    @Args('id', new ParseUUIDPipe()) id: string,
    @Args('input') input: UpdateUniverseInput,
    @UserSub({require: true}) username: string
  ): Promise<MutateUniverseResult> {
    const existing = await this.service.findOne({where: {id}})
    if (!existing) {
      throw new NotFoundException()
    }

    if (username !== existing.ownedByProfile.user.username) {
      throw new ForbiddenException()
    }

    const universe = await this.service.update(id, input)

    return {universe}
  }

  @Mutation()
  async deleteUniverse(
    @Args('id', new ParseUUIDPipe()) id: string,
    @UserSub({require: true}) username: string
  ): Promise<MutateUniverseResult> {
    const existing = await this.service.findOne({where: {id}})
    if (!existing) {
      throw new NotFoundException()
    }

    if (username !== existing.ownedByProfile.user.username) {
      throw new ForbiddenException()
    }

    await this.service.delete(id)

    return {universe: existing}
  }
}
