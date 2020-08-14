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
} from './ProfileValidation'
import ProfileService from './ProfileService'
import Profile from './Profile.entity'

type GetProfileResolver = QueryResolvers<Context>['getProfile']
type GetManyProfilesResolver = QueryResolvers<Context>['getManyProfiles']
type CreateProfileResolver = MutationResolvers<Context>['createProfile']
type UpdateProfileResolver = MutationResolvers<Context>['updateProfile']
type DeleteProfileResolver = MutationResolvers<Context>['deleteProfile']

export const getProfile = (
  service = ProfileService.init
): GetProfileResolver => (_parent, input, _context, _resolveInfo) =>
  pipe(
    fromValue(input),
    validateGet,
    handleValidationResult({
      Valid: ({input: {id}}) => service().findOne({where: {id}}),
      Invalid: () => fromValue(undefined),
    }),
    toPromise
  )

export const getManyProfiles = (
  service = ProfileService.init
): GetManyProfilesResolver => (_parent, input, _context, _resolveInfo) =>
  pipe(
    fromValue(input),
    validateGetMany,
    handleValidationResult({
      Valid: ({input: {where, orderBy, pageSize, page}}) =>
        service().find({where, order: fromOrderBy(orderBy), pageSize, page}),
      Invalid: () => fromValue(paginateResponse<Profile>()),
    }),
    toPromise
  )

export const createProfile = (
  service = ProfileService.init
): CreateProfileResolver => (_parent, {input}, _context, _resolveInfo) =>
  pipe(
    fromValue(input),
    validateCreate,
    handleValidationResult({
      Valid: () => service().create(input),
      Invalid: () => fromValue(undefined),
    }),
    map((profile) => ({profile})),
    toPromise
  )

export const updateProfile = (
  service = ProfileService.init
): UpdateProfileResolver => (_parent, {id, input}, _context, _resolveInfo) =>
  pipe(
    fromValue(input),
    validateUpdate,
    handleValidationResult({
      Valid: () => service().update(id, input),
      Invalid: () => fromValue(undefined),
    }),
    map((profile) => ({profile})),
    toPromise
  )

export const deleteProfile = (
  service = ProfileService.init
): DeleteProfileResolver => (_parent, {id}, _context, _resolveInfo) =>
  pipe(
    service().delete(id),
    map(() => ({})),
    toPromise
  )

const Queries = {
  getProfile: getProfile(),
  getManyProfiles: getManyProfiles(),
}

const Mutations = {
  createProfile: createProfile(),
  updateProfile: updateProfile(),
  deleteProfile: deleteProfile(),
}

export default {Queries, Mutations}
