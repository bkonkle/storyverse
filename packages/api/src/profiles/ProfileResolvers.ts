import {
  BadRequestException,
  ForbiddenException,
  ParseUUIDPipe,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import {Resolver, Query, Args, Mutation, Context} from '@nestjs/graphql'

import {
  Profile,
  ProfilesPage,
  MutateProfileResult,
  CreateProfileInput,
  QueryGetProfileArgs,
  UpdateProfileInput,
  QueryGetManyProfilesArgs,
} from '../Schema'
import {fromOrderBy} from '../lib/resolvers'
import ProfilesService from './ProfilesService'
import {RequireAuthentication} from '../lib/auth/JwtGuard'
import {JwtContext} from '../lib/auth/JwtTypes'
import UsersService from '../users/UsersService'

@Resolver('Profile')
@UseGuards(RequireAuthentication)
export class ProfileResolvers {
  constructor(
    private readonly service: ProfilesService,
    private readonly users: UsersService
  ) {}

  @Query()
  async getProfile(
    @Args() args: QueryGetProfileArgs,
    @Context() context: JwtContext
  ): Promise<Profile | undefined> {
    const {id} = args
    const {req} = context

    if (!req.user?.sub) {
      throw new UnauthorizedException()
    }

    const profile = await this.service.findOne({where: {id}})
    if (!profile) {
      return undefined
    }

    if (req.user.sub !== profile.user.username) {
      throw new ForbiddenException()
    }

    return profile
  }

  @Query()
  async getManyProfiles(
    @Args() args: QueryGetManyProfilesArgs
  ): Promise<ProfilesPage> {
    const {where, orderBy, pageSize, page} = args
    return this.service.find({
      where,
      order: fromOrderBy(orderBy),
      pageSize,
      page,
    })
  }

  @Mutation()
  async createProfile(
    @Args('input') input: CreateProfileInput,
    @Context() context: JwtContext
  ): Promise<MutateProfileResult> {
    const {req} = context

    if (!input.userId && !input.user) {
      throw new BadRequestException(
        'Field "userId" of type "String" or "user" of type "CreateUserInput" was not provided.'
      )
    }

    if (!req.user?.sub) {
      throw new UnauthorizedException()
    }

    const user =
      (input.userId &&
        (await this.users.findOne({where: {id: input.userId}}))) ||
      (input.user && (await this.users.create(input.user)))

    if (!user) {
      return {}
    }

    if (req.user.sub !== user.username) {
      throw new ForbiddenException()
    }

    const profile = await this.service.create({...input, userId: user.id, user})

    return {profile}
  }

  @Mutation()
  async updateProfile(
    @Args('id', new ParseUUIDPipe()) id: string,
    @Args('input') input: UpdateProfileInput,
    @Context() context: JwtContext
  ): Promise<MutateProfileResult> {
    const {req} = context

    if (!req.user?.sub) {
      throw new UnauthorizedException()
    }

    if (input.userId && input.userId !== req.user.sub) {
      throw new ForbiddenException()
    }

    const existing = await this.service.findOne({where: {id}})
    if (!existing) {
      return {}
    }

    if (req.user.sub !== existing.user.username) {
      throw new ForbiddenException()
    }

    const profile = await this.service.update(id, input)

    return {profile}
  }

  @Mutation()
  async deleteProfile(
    @Args('id', new ParseUUIDPipe()) id: string,
    @Context() context: JwtContext
  ): Promise<MutateProfileResult> {
    const {req} = context

    if (!req.user?.sub) {
      throw new UnauthorizedException()
    }

    const existing = await this.service.findOne({where: {id}})
    if (!existing) {
      return {}
    }

    if (req.user.sub !== existing.user.username) {
      throw new ForbiddenException()
    }

    await this.service.delete(id)

    return {profile: existing}
  }
}
