import {
  BadRequestException,
  ForbiddenException,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common'
import {Resolver, Query, Args, Mutation} from '@nestjs/graphql'

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
import UsersService from '../users/UsersService'
import {JwtGuard} from '../lib/auth/JwtGuard'
import {AllowAnonymous, UserSub} from '../lib/auth/JwtDecorators'
import {authorize, authorizeCreate, censor, maybeCensor} from './ProfileUtils'

@Resolver('Profile')
@UseGuards(JwtGuard)
export class ProfileResolvers {
  constructor(
    private readonly service: ProfilesService,
    private readonly users: UsersService
  ) {}

  /**
   * Retrieves a profile by id. Profiles are public, but if the username and token sub don't match,
   * censor the user and email address from the results.
   */
  @Query()
  @AllowAnonymous()
  async getProfile(
    @Args('id', new ParseUUIDPipe()) id: string,
    @UserSub() username?: string
  ): Promise<Profile | undefined> {
    return this.service.findOne({where: {id}}).then(maybeCensor(username))
  }

  /**
   * Lists profiles by various criteria. Profiles are public, but if the username and token sub
   * don't match, censor the user and email address from the results.
   */
  @Query()
  @AllowAnonymous()
  async getManyProfiles(
    @Args() args: QueryGetManyProfilesArgs,
    @UserSub() username?: string
  ): Promise<ProfilesPage> {
    const {where, orderBy, pageSize, page} = args

    const profiles = await this.service.find({
      where,
      order: fromOrderBy(orderBy),
      pageSize,
      page,
    })

    return {
      ...profiles,
      data: profiles.data.map(censor(username)),
    }
  }

  /**
   * Create a new Profile for an authenticated user.
   */
  @Mutation()
  async createProfile(
    @Args('input') input: CreateProfileInput,
    @UserSub({require: true}) username: string
  ): Promise<MutateProfileResult> {
    const user = await this.findOrCreateUser(input, username).then(
      authorizeCreate(username)
    )

    const profile = await this.service.create({...input, userId: user.id, user})

    return {profile}
  }

  /**
   * Update an existing Profile for an authorized user.
   */
  @Mutation()
  async updateProfile(
    @Args('id', new ParseUUIDPipe()) id: string,
    @Args('input') input: UpdateProfileInput,
    @UserSub({require: true}) username: string
  ): Promise<MutateProfileResult> {
    await this.service.findOne({where: {id}}).then(authorize(username))

    const profile = await this.service.update(id, input)

    return {profile}
  }

  /**
   * Delete an existing profile for an authorized user.
   */
  @Mutation()
  async deleteProfile(
    @Args('id', new ParseUUIDPipe()) id: string,
    @UserSub({require: true}) username: string
  ): Promise<MutateProfileResult> {
    const existing = await this.service
      .findOne({where: {id}})
      .then(authorize(username))

    await this.service.delete(id)

    return {profile: existing}
  }

  /**
   * Find or create a User based on CreateProfileInput.
   */
  private async findOrCreateUser(input: CreateProfileInput, username: string) {
    // If a userId was provided, try to find the existing User
    if (input.userId) {
      return this.users.findOne({where: {id: input.userId}})
    }

    // If UserInput was provided, create a new User if authorized
    if (input.user) {
      if (username === input.user.username) {
        return this.users.create(input.user)
      }

      throw new ForbiddenException()
    }

    throw new BadRequestException(
      'Field "userId" of type "String" or "user" of type "CreateUserInput" was not provided.'
    )
  }
}
