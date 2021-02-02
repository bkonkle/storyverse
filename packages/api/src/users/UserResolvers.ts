import {Resolvers, QueryResolvers, MutationResolvers, User} from '../Schema'
import {Context} from '../utils/Context'

export default class UserResolvers {
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
    args,
    _context,
    _resolveInfo
  ) => {
    console.log(`>- UserResolvers.getCurrentUser -<`, args)

    return {} as User
  }

  createUser: MutationResolvers<Context>['createUser'] = async (
    _parent,
    args,
    _context,
    _resolveInfo
  ) => {
    console.log(`>- UserResolvers.createUser -<`, args)

    return {}
  }

  updateCurrentUser: MutationResolvers<Context>['updateCurrentUser'] = async (
    _parent,
    args,
    _context,
    _resolveInfo
  ) => {
    console.log(`>- UserResolvers.updateCurrentUser -<`, args)

    return {}
  }
}
