import {
  makeWrapResolversPlugin,
  makePluginByCombiningPlugins,
  makeExtendSchemaPlugin,
  gql,
  createRequest,
} from '@graft/server'

import ProfileController from './ProfileController'
import {CreateUserInput} from '../Schema'
import {Context} from '../Config'

export const createProfileWithUser = makePluginByCombiningPlugins(
  makeExtendSchemaPlugin({
    typeDefs: gql`
      extend input CreateUserInput {
        profile: ProfilePatch
      }

      extend type CreateUserPayload {
        profile: Profile
      }
    `,
    resolvers: {},
  }),
  makeWrapResolversPlugin({
    Mutation: {
      createUser: async (
        resolver,
        query,
        args,
        context: Context,
        resolveInfo
      ) => {
        const request = createRequest(context, resolveInfo)
        const {profile}: CreateUserInput = args.input

        const result = await resolver(query, args, context, resolveInfo)

        const id = result.data['$id']

        if (!id) {
          throw new Error('Unable to find the id of the created User')
        }

        if (profile) {
          await ProfileController.create(request, {
            ...profile,
            userId: id,
          })
        }

        return result
      },
    },
  })
)

export default [createProfileWithUser]
