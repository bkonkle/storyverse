import {query, mutation} from '@graft/server'

import {AppRequest} from '../Config'
import {
  AllProfilesQuery,
  AllProfilesQueryVariables,
  AllProfilesDocument,
  CreateProfileMutation,
  CreateProfileMutationVariables,
  CreateProfileDocument,
  UpdateProfileByIdMutation,
  UpdateProfileByIdMutationVariables,
  UpdateProfileByIdDocument,
  ProfileInput,
  ProfilePatch,
  ProfileByIdQuery,
  ProfileByIdQueryVariables,
  ProfileByIdDocument,
  ProfileCondition,
  ProfileDataFragment,
} from '../Schema'

namespace Data {
  export const getAll = async (
    request: AppRequest,
    condition?: ProfileCondition
  ): Promise<ProfileDataFragment[]> => {
    const profiles = await query<AllProfilesQuery, AllProfilesQueryVariables>(
      request,
      {
        query: AllProfilesDocument,
        variables: {
          condition,
        },
      }
    )

    const nodes = profiles?.allProfiles?.nodes

    return nodes ? nodes.filter(Boolean) : []
  }

  export const getById = async (
    request: AppRequest,
    id: number
  ): Promise<ProfileDataFragment | undefined> => {
    const profile = await query<ProfileByIdQuery, ProfileByIdQueryVariables>(
      request,
      {
        query: ProfileByIdDocument,
        variables: {id},
      }
    )

    return profile?.profileById || undefined
  }

  export const create = async (
    request: AppRequest,
    profileInput: ProfileInput
  ): Promise<ProfileDataFragment> => {
    const result = await mutation<
      CreateProfileMutation,
      CreateProfileMutationVariables
    >(request, {
      mutation: CreateProfileDocument,
      variables: {
        input: {
          profile: profileInput,
        },
      },
    })

    const profile = result?.createProfile?.profile

    if (!profile) {
      throw new Error('Unable to create Profile')
    }

    return profile
  }

  export const update = async (
    request: AppRequest,
    id: number,
    profilePatch: ProfilePatch
  ): Promise<ProfileDataFragment> => {
    const result = await mutation<
      UpdateProfileByIdMutation,
      UpdateProfileByIdMutationVariables
    >(request, {
      mutation: UpdateProfileByIdDocument,
      variables: {
        input: {id, profilePatch},
      },
    })

    const profile = result?.updateProfileById?.profile

    if (!profile) {
      throw new Error('Unable to update Profile')
    }

    return profile
  }
}

export default {
  getAll: Data.getAll,
  getById: Data.getById,
  create: Data.create,
  update: Data.update,
}
