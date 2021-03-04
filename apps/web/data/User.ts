import {ReactNode, useEffect} from 'react'
import axios from 'axios'

import {AuthUser, useStore} from './Store'

export interface UserState {
  user: AuthUser | null
  loading: boolean
}

export interface UserProviderProps {
  value: UserState
  children: ReactNode
}

// Use a global to save the user, so we don't have to fetch it again after page navigations
let __user: AuthUser | null = null

export const fetchUser = async (): Promise<AuthUser | null> => {
  if (__user) {
    return __user
  }

  try {
    const {data} = await axios.get<AuthUser>('/api/user')
    __user = data
  } catch (error) {
    if (error.response.status !== 401) {
      throw error
    }
  }

  return __user
}

export const useFetchUser = () => {
  const {user, loading, setUser, setLoading} = useStore((state) => state.auth)

  useEffect(() => {
    let isMounted = true

    if (__user) {
      setUser(__user)

      return
    }

    fetchUser()
      .then((fetchedUser) => {
        // Only set the user if the component is still mounted
        if (isMounted) {
          setUser(fetchedUser)
        }
      })
      .catch((err) => {
        console.error('fetchUser error:', err)

        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [setUser, setLoading])

  return {user, loading}
}
