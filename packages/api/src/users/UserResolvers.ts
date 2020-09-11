import {
  paginateResponse,
  handleValidation,
  fromOrderBy,
} from 'cultivar/services'

import {QueryResolvers, MutationResolvers} from '../Schema'
import {Context} from '../utils/Context'
import * as Validate from './UserValidation'
import UserService from './UserService'
import User from './User.entity'

const toUser = async (user?: User) => ({user})
const nothing = async () => ({})

// const requireAuthentication = async (context: Context) => {
//   const {
//     req: {user},
//   } = context

//   if (!user) {
//   }

//   return undefined
// }

export const queries = ({service = UserService.init} = {}): QueryResolvers<
  Context
> => ({
  getUser: (_parent, input, _context, _resolveInfo) =>
    handleValidation(input, Validate.get, {
      Valid: ({input: {id}}) => service().findOne({where: {id}}),
      Invalid: async () => undefined,
    }),

  getManyUsers: (_parent, input, _context, _resolveInfo) =>
    handleValidation(input, Validate.getMany, {
      Valid: ({input: {where, orderBy, pageSize, page}}) =>
        service().find({
          where,
          order: fromOrderBy(orderBy),
          pageSize,
          page,
        }),
      Invalid: async () => paginateResponse<User>(),
    }),
})

export const mutations = ({service = UserService.init} = {}): MutationResolvers<
  Context
> => ({
  createUser: async (_parent, {input}, _context, _resolveInfo) =>
    handleValidation(input, Validate.create, {
      Valid: () => service().create(input).then(toUser),
      Invalid: nothing,
    }),

  updateUser: async (_parent, {id, input}, _context, _resolveInfo) =>
    handleValidation(input, Validate.update, {
      Valid: () => service().update(id, input).then(toUser),
      Invalid: nothing,
    }),

  deleteUser: async (_parent, input, _context, _resolveInfo) =>
    handleValidation(input, Validate.remove, {
      Valid: () => service().delete(input.id).then(nothing),
      Invalid: nothing,
    }),
})

export default {queries, mutations}
