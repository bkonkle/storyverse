import {fromOrderBy} from '../lib/resolvers'

import {QueryResolvers, MutationResolvers} from '../Schema'
import {Context} from '../utils/Context'
import * as Validate from './ProfileValidation'
import ProfileService from './ProfileService'
import Profile from './Profile.entity'

export const queries = ({service = ProfileService.init} = {}): QueryResolvers<
  Context
> => ({
  getProfile: async (_parent, args, _context, _resolveInfo) => {
    const {id} = await Validate.get(args)

    return service().findOne({where: {id}})
  },

  getManyProfiles: async (_parent, args, _context, _resolveInfo) => {
    const {where, orderBy, pageSize, page} = await Validate.getMany(args)

    return service().find({
      where,
      order: fromOrderBy(orderBy),
      pageSize,
      page,
    })
  },
})

export const mutations = ({
  service = ProfileService.init,
} = {}): MutationResolvers<Context> => ({
  createProfile: async (_parent, args, _context, _resolveInfo) => {
    const {input} = await Validate.create(args)

    const profile = await service().create(input)

    return {profile}
  },

  updateProfile: async (_parent, args, _context, _resolveInfo) => {
    const {id, input} = await Validate.update(args)

    const profile = await service().update(id, input)

    return {profile}
  },

  deleteProfile: async (_parent, args, _context, _resolveInfo) => {
    const {id} = await Validate.remove(args)

    await service().delete(id)

    return {}
  },
})

export default {queries, mutations}
