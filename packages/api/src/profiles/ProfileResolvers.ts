import {pipe, map, fromValue, toPromise} from 'wonka'
import {handleValidationResult} from 'cultivar/utils/validation'

import {QueryResolvers, MutationResolvers} from '../Schema'
import {Context} from '../utils/Context'
import {
  validateCreate,
  validateGetById,
  validateUpdate,
} from './ProfileValidation'
import ProfileService from './ProfileService'

type ProfileResolver = QueryResolvers<Context>['profile']
type CreateProfileResolver = MutationResolvers<Context>['createProfile']
type UpdateProfileResolver = MutationResolvers<Context>['updateProfile']

export const profile = (service = ProfileService.init): ProfileResolver => (
  _parent,
  input,
  _context: Context,
  _resolveInfo
) =>
  pipe(
    validateGetById(input),
    handleValidationResult({
      Valid: ({input: {id}}) => service().get(id),
      Invalid: () => fromValue(undefined),
    }),
    toPromise
  )

export const createProfile = (
  service = ProfileService.init
): CreateProfileResolver => (
  _parent,
  {input, mutationId},
  _context,
  _resolveInfo
) =>
  pipe(
    validateCreate(input),
    handleValidationResult({
      Valid: () => service().create(input),
      Invalid: () => fromValue(undefined),
    }),
    map((profile) => ({profile, mutationId})),
    toPromise
  )

export const updateProfile = (
  service = ProfileService.init
): UpdateProfileResolver => (
  _parent,
  {id, input, mutationId},
  _context,
  _resolveInfo
) =>
  pipe(
    validateUpdate(input),
    handleValidationResult({
      Valid: () => service().update(id, input),
      Invalid: () => fromValue(undefined),
    }),
    map((profile) => ({profile, mutationId})),
    toPromise
  )

const Queries = {
  profile: profile(),
}

const Mutations = {
  createProfile: createProfile(),
  updateProfile: updateProfile(),
}

export default {Queries, Mutations}
