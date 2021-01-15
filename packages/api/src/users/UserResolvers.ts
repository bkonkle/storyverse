import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common'
import {Resolver, Query, Args, Mutation} from '@nestjs/graphql'

import {
  User,
  MutateUserResult,
  CreateUserInput,
  UpdateUserInput,
} from '../Schema'
import {JwtGuard} from '../lib/auth/JwtGuard'
import {UserSub} from '../lib/auth/JwtDecorators'
import ProfilesService from '../profiles/ProfilesService'
import UsersService from './UsersService'
import {authorize, authorizeCreate} from './UserUtils'

@Resolver('User')
@UseGuards(JwtGuard)
export class UserResolvers {
  constructor(
    private readonly service: UsersService,
    private readonly profiles: ProfilesService
  ) {}

  @Query()
  async getCurrentUser(
    @UserSub({require: true}) username: string
  ): Promise<User | undefined> {
    return this.service.findOne({where: {username}})
  }

  @Mutation()
  async createUser(
    @Args('input') input: CreateUserInput,
    @UserSub({require: true}) username: string
  ): Promise<MutateUserResult> {
    authorize(username, input)

    const profile = await this.findOrCreateProfile(input).then(authorizeCreate)

    const user = await this.service.create({
      ...input,
      profileId: profile.id,
      profile,
    })

    return {user}
  }

  @Mutation()
  async updateCurrentUser(
    @Args('input') input: UpdateUserInput,
    @UserSub({require: true}) username: string
  ): Promise<MutateUserResult> {
    const user = await this.service.findOne({where: {username}})
    if (!user) {
      throw new NotFoundException()
    }

    const updated = await this.service.update(user.id, input)

    return {user: updated}
  }

  /**
   * Find or create a Profile based on CreateUserInput.
   */
  private async findOrCreateProfile(input: CreateUserInput) {
    // If a profileId was provided, try to find the existing Profile
    if (input.profileId) {
      return this.profiles.findOne({
        where: {id: input.profileId},
      })
    }

    // If CreateProfileInput was provided, create a new Profile if authorized
    if (input.profile) {
      return this.profiles.create(input.profile)
    }

    throw new BadRequestException(
      'Field profileId of type String or profile of type CreateProfileInput was not provided.'
    )
  }
}
