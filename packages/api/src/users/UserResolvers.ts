import {ForbiddenException, UseGuards} from '@nestjs/common'
import {Resolver, Query, Args, Mutation, Context} from '@nestjs/graphql'

import {User, UsersPage, MutateUserResult} from '../Schema'
import {fromOrderBy} from '../lib/resolvers'
import UsersService from './UsersService'
import GetUserArgs from './data/GetUserArgs'
import GetManyUsersArgs from './data/GetManyUsersArgs'
import CreateUserArgs from './data/CreateUserArgs'
import UpdateUserArgs from './data/UpdateUserArgs'
import DeleteUserArgs from './data/DeleteUserArgs'
import {RequireAuthentication} from '../auth/JwtGuard'
import {JwtContext} from '../auth/JwtTypes'

@Resolver('User')
export class UserResolvers {
  constructor(private readonly service: UsersService) {}

  @UseGuards(RequireAuthentication)
  @Query()
  async getUser(@Args() args: GetUserArgs): Promise<User | undefined> {
    const {id} = args

    return this.service.findOne({where: {id}})
  }

  @Query()
  async getManyUsers(@Args() args: GetManyUsersArgs): Promise<UsersPage> {
    const {where, orderBy, pageSize, page} = args

    return this.service.find({
      where,
      order: fromOrderBy(orderBy),
      pageSize,
      page,
    })
  }

  @UseGuards(RequireAuthentication)
  @Mutation()
  async createUser(
    @Args() args: CreateUserArgs,
    @Context() context: JwtContext
  ): Promise<MutateUserResult> {
    const {input} = args
    const {req} = context

    console.log(
      `>- req.user.sub, input.username ->`,
      req.user?.sub,
      input.username
    )

    console.log(`>- req.jwt ->`, req.jwt)
    console.log(`>- req.token ->`, req.token)

    if (!req.user || !req.user.sub || req.user.sub !== input.username) {
      throw new ForbiddenException()
    }

    const user = await this.service.create(input)

    return {user}
  }

  @Mutation()
  async updateUser(@Args() args: UpdateUserArgs): Promise<MutateUserResult> {
    const {id, input} = args

    const user = await this.service.update(id, input)

    return {user}
  }

  @Mutation()
  async deleteUser(@Args() args: DeleteUserArgs): Promise<MutateUserResult> {
    const {id} = args

    await this.service.delete(id)

    return {}
  }
}
