import {makeWrapResolversPlugin} from 'graphile-utils'
import {Context} from '../Config'

export const anonymousGetCurrentUser = makeWrapResolversPlugin({
  Mutation: {
    getCurrentUser: async (
      resolver,
      query,
      args,
      context: Context,
      resolveInfo
    ) => {
      if (!context.user) {
        return
      }

      return resolver(query, args, context, resolveInfo)
    },
  },
})

export default [anonymousGetCurrentUser]
