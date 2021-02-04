import {Resolvers, QueryResolvers, MutationResolvers} from '../Schema'
import {Context} from '../utils/Context'
import {NotFoundError} from '../utils/Errors'
import UsersService from './UsersService'
import {getUsername, requireMatchingUsername} from './UserUtils'

export default class UserResolvers {
  private readonly service: UsersService

  constructor(service?: UsersService) {
    this.service = service || new UsersService()
  }

  getResolvers = (): Resolvers => ({
    Query: {
      getCurrentUser: this.getCurrentUser,
    },
    Mutation: {
      createUser: this.createUser,
      updateCurrentUser: this.updateCurrentUser,
    },
  })

  getCurrentUser: QueryResolvers<Context>['getCurrentUser'] = async (
    _parent,
    _args,
    context,
    _resolveInfo
  ) => {
    const username = getUsername(context)

    return this.service.findFirst({where: {username}})
  }

  createUser: MutationResolvers<Context>['createUser'] = async (
    _parent,
    {input},
    context,
    _resolveInfo
  ) => {
    requireMatchingUsername(context, input.username)

    const user = await this.service.create({
      data: input,
    })

    return {user}
  }

  updateCurrentUser: MutationResolvers<Context>['updateCurrentUser'] = async (
    _parent,
    {input},
    context,
    _resolveInfo
  ) => {
    const username = getUsername(context)

    const user = await this.service.findFirst({where: {username}})
    if (!user) {
      throw new NotFoundError('Not found')
    }

    const updated = await this.service.update({
      where: {username},
      data: {
        username: input.username || undefined,
        isActive: input.isActive === null ? undefined : input.isActive,
      },
    })

    return {user: updated}
  }
}
