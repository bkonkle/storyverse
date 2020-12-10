import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
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

  /**
   * Retrieves a profile by id. Profiles are public, but the requesting user
   * must at least be authenticated.
   */
  @Query()
  async getProfile(
    @Args('id', new ParseUUIDPipe()) id: string
  ): Promise<Profile | undefined> {
    return this.service.findOne({where: {id}})
  }

  /**
   * Lists profiles by various criteria. Profiles are public, but the requesting
   * user must at least be authenticated.
   */
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

  /**
   * Create a new Profile for an authenticated user.
   */
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

    if (req.user.sub !== input.user?.username) {
      throw new ForbiddenException()
    }

    const user =
      // If a userId was provided, try to find the existing User
      (input.userId &&
        (await this.users.findOne({where: {id: input.userId}}))) ||
      // If UserInput was provided, create a new User
      (input.user && (await this.users.create(input.user)))

    // If no user was found or created, throw an error
    if (!user) {
      throw new BadRequestException(
        'An existing User must be found or valid UserInput must be provided.'
      )
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
      throw new NotFoundException()
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
      throw new NotFoundException()
    }

    if (req.user.sub !== existing.user.username) {
      throw new ForbiddenException()
    }

    await this.service.delete(id)

    return {profile: existing}
  }
}
