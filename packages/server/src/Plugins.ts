import UserResolvers from './users/UserResolvers'
import {IncomingMessage} from './Config'

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

export const plugins = [...UserResolvers]

export default {
  pgSettings,
  getGraphQLContext,
  plugins,
}
