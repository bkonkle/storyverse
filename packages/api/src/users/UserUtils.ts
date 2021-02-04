import {AuthenticationError, ForbiddenError} from 'apollo-server-core'
import {Context, Token} from '../utils/Context'

export const maybeUser = (context: Context): Token | null => {
  const {
    req: {user},
  } = context

  return user || null
}

export const maybeUsername = (context: Context): string | null =>
  maybeUser(context)?.sub || null

export const getUser = (context: Context): Token => {
  const user = maybeUser(context)

  if (!user) {
    throw new AuthenticationError('Authentication required')
  }

  return user
}

export const getUsername = (context: Context): string => getUser(context).sub

export const requireMatchingUsername = (context: Context, username: string) => {
  if (getUsername(context) !== username) {
    throw new ForbiddenError('Authorization required')
  }
}
