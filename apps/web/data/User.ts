import {useEffect} from 'react'
import {useRouter} from 'next/router'
import {User} from 'next-auth'
import {useSession} from 'next-auth/client'

import {useGetOrCreateCurrentUserMutation} from '../data/Schema'

export const useInitUser = (options: {requireUser?: boolean}) => {
  const {requireUser} = options
  const [session, sessionLoading] = useSession()
  const [userData, getOrCreateCurrentUser] = useGetOrCreateCurrentUserMutation()
  const router = useRouter()

  const user = userData.data?.getOrCreateCurrentUser.user

  const loading = sessionLoading || userData.fetching

  /**
   * Check for the session and ensure the user is fetched if found.
   */
  useEffect(() => {
    if (requireUser && !loading && !session) {
      router.push('/')

      return
    }

    if (session && !user && !loading) {
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
  }, [session, loading, user, requireUser, getOrCreateCurrentUser, router])

  return {user, loading}
}
