import Debug from 'debug'
import {GraphQLError, formatError} from 'graphql'
import {GraphQLErrorExtended} from 'postgraphile'

import {Environment, IncomingMessage} from './Config'

const debug = Debug('storyverse-api:Plugins')

export async function pgSettings(req: IncomingMessage) {
  const sub = req.user && req.user.sub

  return {
    'jwt.claims.sub': sub,
    role: 'storyverse_user',
  }
}

export const getGraphQLContext = async (req: IncomingMessage) => ({
  user: req.user,
})

export const plugins = []

export const handleErrors = (errors: GraphQLError[]) =>
  errors.map((error: GraphQLError) => {
    const formattedError = formatError(error) as GraphQLErrorExtended

    // If this is dev, add the stack to the formatted error.
    if (Environment.isDev) {
      debug(error)

      if (formattedError.extensions) {
        formattedError.extensions.stack = error.stack
      } else {
        formattedError.stack = error.stack
      }
    }

    return formattedError
  })

export default {
  pgSettings,
  getGraphQLContext,
  plugins,
  handleErrors,
}
