import {ForbiddenException, NotFoundException, UseGuards} from '@nestjs/common'
import {Resolver, Query, Args, Mutation} from '@nestjs/graphql'

import {
  User,
  MutateUserResult,
  CreateUserInput,
  UpdateUserInput,
} from '../Schema'
import UsersService from './UsersService'
import {JwtGuard} from '../lib/auth/JwtGuard'
import {UserSub} from '../lib/auth/JwtDecorators'

@Resolver('User')
@UseGuards(JwtGuard)
export class UserResolvers {
  constructor(private readonly service: UsersService) {}

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
    if (username !== input.username) {
      throw new ForbiddenException()
    }

    const user = await this.service.create(input)

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
}
