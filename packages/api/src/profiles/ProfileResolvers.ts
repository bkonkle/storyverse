import {pipe, map, fromValue, toPromise} from 'wonka'
import {paginateResponse} from 'cultivar/utils/pagination'
import {handleValidation, nothing} from 'cultivar/utils/validation'
import {fromOrderBy} from 'cultivar/utils/typeorm'

import {QueryResolvers, MutationResolvers} from '../Schema'
import {Context} from '../utils/Context'
import * as Validate from './ProfileValidation'
import ProfileService from './ProfileService'
import Profile from './Profile.entity'

export const queries = ({service = ProfileService.init} = {}): QueryResolvers<
  Context
> => ({
  getProfile: (_parent, input, _context, _resolveInfo) =>
    pipe(
      handleValidation(input, Validate.get, {
        Valid: ({input: {id}}) => service().findOne({where: {id}}),
        Invalid: nothing,
      }),
      toPromise
    ),

  getManyProfiles: (_parent, input, _context, _resolveInfo) =>
    pipe(
      handleValidation(input, Validate.getMany, {
        Valid: ({input: {where, orderBy, pageSize, page}}) =>
          service().find({where, order: fromOrderBy(orderBy), pageSize, page}),
        Invalid: () => fromValue(paginateResponse<Profile>()),
      }),
      toPromise
    ),
})

export const mutations = ({
  service = ProfileService.init,
} = {}): MutationResolvers<Context> => ({
  createProfile: (_parent, {input}, _context, _resolveInfo) =>
    pipe(
      handleValidation(input, Validate.create, {
        Valid: () => service().create(input),
        Invalid: nothing,
      }),
      map((profile) => ({profile})),
      toPromise
    ),

  updateProfile: (_parent, {id, input}, _context, _resolveInfo) =>
    pipe(
      handleValidation(input, Validate.update, {
        Valid: () => service().update(id, input),
        Invalid: nothing,
      }),
      map((profile) => ({profile})),
      toPromise
    ),

  deleteProfile: (_parent, input, _context, _resolveInfo) =>
    pipe(
      handleValidation(input, Validate.remove, {
        Valid: () => service().delete(input.id),
        Invalid: nothing,
      }),
      map(() => ({})),
      toPromise
    ),
})

export default {queries, mutations}
