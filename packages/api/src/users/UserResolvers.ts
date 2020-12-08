import {
  ForbiddenException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import {Resolver, Query, Args, Mutation, Context} from '@nestjs/graphql'

import {
  User,
  MutateUserResult,
  CreateUserInput,
  UpdateUserInput,
} from '../Schema'
import UsersService from './UsersService'
import {RequireAuthentication} from '../lib/auth/JwtGuard'
import {JwtContext} from '../lib/auth/JwtTypes'

@Resolver('User')
@UseGuards(RequireAuthentication)
export class UserResolvers {
  constructor(private readonly service: UsersService) {}

  @Query()
  async getCurrentUser(
    @Context() context: JwtContext
  ): Promise<User | undefined> {
    const {req} = context

    if (!req.user?.sub) {
      throw new UnauthorizedException()
    }

    return this.service.findOne({where: {username: req.user.sub}})
  }

  @Mutation()
  async createUser(
    @Args('input') input: CreateUserInput,
    @Context() context: JwtContext
  ): Promise<MutateUserResult> {
    const {req} = context

    if (req.user?.sub !== input.username) {
      throw new ForbiddenException()
    }

    const user = await this.service.create(input)

    return {user}
  }

  @Mutation()
  async updateCurrentUser(
    @Args('input') input: UpdateUserInput,
    @Context() context: JwtContext
  ): Promise<MutateUserResult> {
    const {req} = context

    if (!req.user?.sub) {
      throw new UnauthorizedException()
    }

    const user = await this.service.findOne({where: {username: req.user.sub}})
    if (!user) {
      return {}
    }

    const updated = await this.service.update(user.id, input)

    return {user: updated}
  }
}
