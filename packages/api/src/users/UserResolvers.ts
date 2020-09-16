import {fromOrderBy} from '../lib/resolvers'

import {QueryResolvers, MutationResolvers} from '../Schema'
import {Context} from '../utils/Context'
import * as Validate from './UserValidation'
import UserService from './UserService'

export const queries = ({service = UserService.init} = {}): QueryResolvers<
  Context
> => ({
  getUser: async (_parent, args, _context, _resolveInfo) => {
    const {id} = await Validate.get(args)

    return service().findOne({where: {id}})
  },

  getManyUsers: async (_parent, args, _context, _resolveInfo) => {
    const {where, orderBy, pageSize, page} = await Validate.getMany(args)

    return service().find({
      where,
      order: fromOrderBy(orderBy),
      pageSize,
      page,
    })
  },
})

export const mutations = ({service = UserService.init} = {}): MutationResolvers<
  Context
> => ({
  createUser: async (_parent, args, _context, _resolveInfo) => {
    const {input} = await Validate.create(args)

    const user = await service().create(input)

    return {user}
  },

  updateUser: async (_parent, args, _context, _resolveInfo) => {
    const {id, input} = await Validate.update(args)

    const user = await service().update(id, input)

    return {user}
  },

  deleteUser: async (_parent, args, _context, _resolveInfo) => {
    const {id} = await Validate.remove(args)

    await service().delete(id)

    return {}
  },
})

export default {queries, mutations}
