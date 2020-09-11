import {
  paginateResponse,
  handleValidation,
  fromOrderBy,
} from 'cultivar/services'

import {QueryResolvers, MutationResolvers} from '../Schema'
import {Context} from '../utils/Context'
import * as Validate from './ProfileValidation'
import ProfileService from './ProfileService'
import Profile from './Profile.entity'

const toProfile = async (profile?: Profile) => ({profile})
const nothing = async () => ({})

export const queries = ({service = ProfileService.init} = {}): QueryResolvers<
  Context
> => ({
  getProfile: async (_parent, input, _context, _resolveInfo) =>
    handleValidation(input, Validate.get, {
      Valid: ({input: {id}}) => service().findOne({where: {id}}),
      Invalid: async () => undefined,
    }),

  getManyProfiles: (_parent, input, _context, _resolveInfo) =>
    handleValidation(input, Validate.getMany, {
      Valid: ({input: {where, orderBy, pageSize, page}}) =>
        service().find({where, order: fromOrderBy(orderBy), pageSize, page}),
      Invalid: async () => paginateResponse<Profile>(),
    }),
})

export const mutations = ({
  service = ProfileService.init,
} = {}): MutationResolvers<Context> => ({
  createProfile: async (_parent, {input}, _context, _resolveInfo) =>
    handleValidation(input, Validate.create, {
      Valid: () => service().create(input).then(toProfile),
      Invalid: nothing,
    }),

  updateProfile: async (_parent, {id, input}, _context, _resolveInfo) =>
    handleValidation(input, Validate.update, {
      Valid: () => service().update(id, input).then(toProfile),
      Invalid: nothing,
    }),

  deleteProfile: async (_parent, input, _context, _resolveInfo) =>
    handleValidation(input, Validate.remove, {
      Valid: () => service().delete(input.id).then(nothing),
      Invalid: nothing,
    }),
})

export default {queries, mutations}
