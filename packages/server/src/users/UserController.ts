import {query, mutation} from '@graft/server'

import {AppRequest} from '../Config'
import {
  AllUsersQuery,
  AllUsersQueryVariables,
  AllUsersDocument,
  CreateUserMutation,
  CreateUserMutationVariables,
  CreateUserDocument,
  UpdateUserByIdMutation,
  UpdateUserByIdMutationVariables,
  UpdateUserByIdDocument,
  UserInput,
  UserPatch,
  UserByIdQuery,
  UserByIdQueryVariables,
  UserByIdDocument,
  UserCondition,
  UserDataFragment,
} from '../Schema'

namespace Data {
  export const getAll = async (
    request: AppRequest,
    condition?: UserCondition
  ): Promise<UserDataFragment[]> => {
    const users = await query<AllUsersQuery, AllUsersQueryVariables>(request, {
      query: AllUsersDocument,
      variables: {
        condition,
      },
    })

    const nodes = users?.allUsers?.nodes

    return nodes ? nodes.filter(Boolean) : []
  }

  export const getById = async (
    request: AppRequest,
    id: number
  ): Promise<UserDataFragment | undefined> => {
    const user = await query<UserByIdQuery, UserByIdQueryVariables>(request, {
      query: UserByIdDocument,
      variables: {id},
    })

    return user?.userById || undefined
  }

  export const create = async (
    request: AppRequest,
    userInput: UserInput
  ): Promise<UserDataFragment> => {
    const result = await mutation<
      CreateUserMutation,
      CreateUserMutationVariables
    >(request, {
      mutation: CreateUserDocument,
      variables: {
        input: {
          user: userInput,
        },
      },
    })

    const user = result?.createUser?.user

    if (!user) {
      throw new Error('Unable to create User')
    }

    return user
  }

  export const update = async (
    request: AppRequest,
    id: number,
    userPatch: UserPatch
  ): Promise<UserDataFragment> => {
    const result = await mutation<
      UpdateUserByIdMutation,
      UpdateUserByIdMutationVariables
    >(request, {
      mutation: UpdateUserByIdDocument,
      variables: {
        input: {id, userPatch},
      },
    })

    const user = result?.updateUserById?.user

    if (!user) {
      throw new Error('Unable to update User')
    }

    return user
  }
}

export default {
  getAll: Data.getAll,
  getById: Data.getById,
  create: Data.create,
  update: Data.update,
}
