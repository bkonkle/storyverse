import {Resolver, Query, Args, Mutation} from '@nestjs/graphql'

import {User, UsersPage, MutateUserResult} from '../Schema'
import {fromOrderBy} from '../lib/resolvers'
import UsersService from './UsersService'
import GetUserArgs from './data/GetUserArgs'
import GetManyUsersArgs from './data/GetManyUsersArgs'
import CreateUserArgs from './data/CreateUserArgs'
import UpdateUserArgs from './data/UpdateUserArgs'
import DeleteUserArgs from './data/DeleteUserArgs'

@Resolver('User')
export class UserResolvers {
  constructor(private readonly service: UsersService) {}

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

  @Mutation()
  async createUser(@Args() args: CreateUserArgs): Promise<MutateUserResult> {
    const {input} = args

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
