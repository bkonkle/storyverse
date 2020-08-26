import {pipe, map, fromValue, toPromise} from 'wonka'
import {paginateResponse} from 'cultivar/utils/pagination'
import {handleValidation, nothing} from 'cultivar/utils/validation'
import {fromOrderBy} from 'cultivar/utils/typeorm'

import {QueryResolvers, MutationResolvers} from '../Schema'
import {Context} from '../utils/Context'
import * as Validate from './UserValidation'
import UserService from './UserService'
import User from './User.entity'

export const queries = ({service = UserService.init} = {}): QueryResolvers<
  Context
> => ({
  getUser: (_parent, input, _context, _resolveInfo) =>
    pipe(
      handleValidation(input, Validate.get, {
        Valid: ({input: {id}}) => service().findOne({where: {id}}),
        Invalid: nothing,
      }),
      toPromise
    ),

  getManyUsers: (_parent, input, _context, _resolveInfo) =>
    pipe(
      handleValidation(input, Validate.getMany, {
        Valid: ({input: {where, orderBy, pageSize, page}}) =>
          service().find({
            where,
            order: fromOrderBy(orderBy),
            pageSize,
            page,
          }),
        Invalid: () => fromValue(paginateResponse<User>()),
      }),
      toPromise
    ),
})

export const mutations = ({service = UserService.init} = {}): MutationResolvers<
  Context
> => ({
  createUser: (_parent, {input}, _context, _resolveInfo) =>
    pipe(
      handleValidation(input, Validate.create, {
        Valid: () => service().create(input),
        Invalid: nothing,
      }),
      map((user) => ({user})),
      toPromise
    ),

  updateUser: (_parent, {id, input}, _context, _resolveInfo) =>
    pipe(
      handleValidation(input, Validate.update, {
        Valid: () => service().update(id, input),
        Invalid: nothing,
      }),
      map((user) => ({user})),
      toPromise
    ),

  deleteUser: (_parent, input, _context, _resolveInfo) =>
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
