import {Resolvers, MutationResolvers} from '../Schema'
import {Context} from '../utils/Context'

export default class RoleGrantResolvers {
  getResolvers = (): Resolvers => ({
    Mutation: {
      createRoleGrant: this.createRoleGrant,
      deleteRoleGrant: this.deleteRoleGrant,
    },
  })

  /**
   * Grant a new Role to a User Profile.
   */
  createRoleGrant: MutationResolvers<Context>['createRoleGrant'] = (
    _parent,
    args,
    _context,
    _resolveInfo
  ) => {
    console.log(`>- RoleGrantResolvers.createRoleGrant -<`, args)

    return {}
  }

  /**
   * Delete an existing RoleGrant.
   */
  deleteRoleGrant: MutationResolvers<Context>['deleteRoleGrant'] = (
    _parent,
    args,
    _context,
    _resolveInfo
  ) => {
    console.log(`>- RoleGrantResolvers.deleteRoleGrant -<`, args)

    return {}
  }
}
