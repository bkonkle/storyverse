import {Resolvers, QueryResolvers, MutationResolvers, Profile} from '../Schema'
import {Context} from '../utils/Context'

export default class ProfileResolvers {
  getResolvers = (): Resolvers => ({
    Query: {
      getProfile: this.getProfile,
      getManyProfiles: this.getManyProfiles,
    },
    Mutation: {
      createProfile: this.createProfile,
      updateProfile: this.updateProfile,
      deleteProfile: this.deleteProfile,
    },
  })

  getProfile: QueryResolvers<Context>['getProfile'] = async (
    _parent,
    args,
    _context,
    _resolveInfo
  ) => {
    console.log(`>- ProfileResolvers.getProfile -<`, args)

    return {} as Profile
  }

  getManyProfiles: QueryResolvers<Context>['getManyProfiles'] = async (
    _parent,
    args,
    _context,
    _resolveInfo
  ) => {
    console.log('>- ProfileResolvers.getManyProfiles -<', args)

    return {
      data: [] as Profile[],
      count: 0,
      total: 0,
      page: 0,
      pageCount: 0,
    }
  }

  createProfile: MutationResolvers<Context>['createProfile'] = async (
    _parent,
    args,
    _context,
    _resolveInfo
  ) => {
    console.log('>- ProfileResolvers.createProfile -<', args)

    return {}
  }

  updateProfile: MutationResolvers<Context>['updateProfile'] = async (
    _parent,
    args,
    _context,
    _resolveInfo
  ) => {
    console.log('>- ProfileResolvers.updateProfile -<', args)

    return {}
  }

  deleteProfile: MutationResolvers<Context>['deleteProfile'] = async (
    _parent,
    args,
    _context,
    _resolveInfo
  ) => {
    console.log('>- ProfileResolvers.deleteProfile -<', args)

    return {}
  }
}
