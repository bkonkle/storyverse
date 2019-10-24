import Debug from 'debug'
import Http from 'http'
import Koa from 'koa'
import {GraphQLError, formatError} from 'graphql'
import {GraphQLErrorExtended} from 'postgraphile'

import {Environment} from './Config'

export interface IncomingMessage extends Http.IncomingMessage {
  _koaCtx?: Koa.Context
}

export interface AdditionalContext {}

const debug = Debug('storyverse-api:Plugins')

export async function pgSettings(_req: IncomingMessage) {
  return {
    role: 'storyverse_user',
  }
}

export const getGraphQLContext = async (
  _req: IncomingMessage
): Promise<AdditionalContext> => {
  return {}
}

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
