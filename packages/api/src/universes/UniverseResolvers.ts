import {
  BadRequestException,
  ForbiddenException,
  ParseUUIDPipe,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import {Resolver, Query, Args, Mutation, Context} from '@nestjs/graphql'

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
import {RequireAuthentication} from '../lib/auth/JwtGuard'
import ProfilesService from '../profiles/ProfilesService'
import {JwtContext} from '../lib/auth/JwtTypes'

@Resolver('Universe')
@UseGuards(RequireAuthentication)
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
    @Context() context: JwtContext
  ): Promise<MutateUniverseResult> {
    const {req} = context
    if (!req.user?.sub) {
      throw new UnauthorizedException()
    }

    const profile = await this.profiles.findOne({
      where: {id: input.ownedByProfileId},
    })
    if (!profile) {
      throw new BadRequestException(
        'The specified owned-by `Profile` was not found.'
      )
    }

    if (req.user.sub !== profile.user.username) {
      throw new ForbiddenException()
    }

    const universe = await this.service.create(input)

    return {universe}
  }

  @Mutation()
  async updateUniverse(
    @Args('id', new ParseUUIDPipe()) id: string,
    @Args('input') input: UpdateUniverseInput
  ): Promise<MutateUniverseResult> {
    const universe = await this.service.update(id, input)

    return {universe}
  }

  @Mutation()
  async deleteUniverse(
    @Args('id', new ParseUUIDPipe()) id: string
  ): Promise<MutateUniverseResult> {
    await this.service.delete(id)

    return {}
  }
}
