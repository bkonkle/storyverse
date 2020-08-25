import {pipe, map, fromValue, toPromise} from 'wonka'
import {paginateResponse} from 'cultivar/utils/pagination'
import {handleValidationResult} from 'cultivar/utils/validation'
import {fromOrderBy} from 'cultivar/utils/typeorm'

import {QueryResolvers, MutationResolvers} from '../Schema'
import {Context} from '../utils/Context'
import {
  validateCreate,
  validateGet,
  validateUpdate,
  validateGetMany,
  validateDelete,
} from './UserValidation'
import UserService from './UserService'
import User from './User.entity'

export const getUser = (
  service = UserService.init
): QueryResolvers<Context>['getUser'] => (
  _parent,
  input,
  _context,
  _resolveInfo
) =>
  pipe(
    fromValue(input),
    validateGet,
    handleValidationResult({
      Valid: ({input: {id}}) => service().findOne({where: {id}}),
      Invalid: () => fromValue(undefined),
    }),
    toPromise
  )

export const getManyUsers = (
  service = UserService.init
): QueryResolvers<Context>['getManyUsers'] => (
  _parent,
  input,
  _context,
  _resolveInfo
) =>
  pipe(
    fromValue(input),
    validateGetMany,
    handleValidationResult({
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
  )

export const createUser = (
  service = UserService.init
): MutationResolvers<Context>['createUser'] => (
  _parent,
  {input},
  _context,
  _resolveInfo
) =>
  pipe(
    fromValue(input),
    validateCreate,
    handleValidationResult({
      Valid: () => service().create(input),
      Invalid: () => fromValue(undefined),
    }),
    map((user) => ({user})),
    toPromise
  )

export const updateUser = (
  service = UserService.init
): MutationResolvers<Context>['updateUser'] => (
  _parent,
  {id, input},
  _context,
  _resolveInfo
) =>
  pipe(
    fromValue(input),
    validateUpdate,
    handleValidationResult({
      Valid: () => service().update(id, input),
      Invalid: () => fromValue(undefined),
    }),
    map((user) => ({user})),
    toPromise
  )

export const deleteUser = (
  service = UserService.init
): MutationResolvers<Context>['deleteUser'] => (
  _parent,
  input,
  _context,
  _resolveInfo
) =>
  pipe(
    fromValue(input),
    validateDelete,
    handleValidationResult({
      Valid: () => service().delete(input.id),
      Invalid: () => fromValue(undefined),
    }),
    map(() => ({})),
    toPromise
  )

const Queries = {
  getUser: getUser(),
  getManyUsers: getManyUsers(),
}

const Mutations = {
  createUser: createUser(),
  updateUser: updateUser(),
  deleteUser: deleteUser(),
}

export default {Queries, Mutations}
