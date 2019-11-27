import {logout, user} from '../data/AuthClient'
import {
  GetCurrentUserQuery,
  useCreateUserMutation,
  UserDataFragment,
} from '../data/Schema'

export const handleUserData = (
  createUser: ReturnType<typeof useCreateUserMutation>[1],
  data?: GetCurrentUserQuery
) => () => {
  if (data?.getCurrentUser === null) {
    // The user doesn't exist in the database yet. Check for an Auth0 user.
    if (!user) {
      // The user isn't fully logged in - log them out to try again
      logout()

      return
    }

    // Create a Storyverse user and profile
    createUser({
      input: {
        user: {
          isActive: true,
          username: user.sub,
        },
        profile: {
          displayName: user.name,
          email: user.email,
          picture: user.picture,
        },
      },
    })
  }
}

export const getProfile = (user?: UserDataFragment | null) =>
  user?.profilesByUserId.nodes[0]
