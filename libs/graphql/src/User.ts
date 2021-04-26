import {useEffect} from 'react'
import {useRouter} from 'next/router'
import {User} from 'next-auth'
import {useSession, signOut} from 'next-auth/client'

import {useGetOrCreateCurrentUserMutation} from './Schema'

export const useInitUser = (options: {requireUser?: boolean}) => {
  const {requireUser} = options
  const [session, sessionLoading] = useSession()
  const [userData, getOrCreateCurrentUser] = useGetOrCreateCurrentUserMutation()
  const router = useRouter()

  const user = userData.data?.getOrCreateCurrentUser.user
  const error = userData.error

  const loading = sessionLoading || userData.fetching

  /**
   * Check for the session and ensure the user is fetched if found.
   */
  useEffect(() => {
    if (requireUser && !loading && !session) {
      router.push('/')

      return
    }

    if (session && !loading && !user) {
      if (error) {
        if (error.response?.status === 401) {
          // The session isn't valid, so reset it
          signOut()
        } else {
          console.log('Error while fetching current user:', error)
        }

        return
      }

      const user = session.user as User & {sub: string}
      if (!user.email) {
        throw new Error('User email not found on session')
      }

      getOrCreateCurrentUser({
        input: {
          username: user.sub,
          profile: {
            email: user.email,
            picture: user.image,
          },
        },
      })
    }
  }, [
    session,
    loading,
    error,
    user,
    requireUser,
    getOrCreateCurrentUser,
    router,
  ])

  return {user, loading}
}
