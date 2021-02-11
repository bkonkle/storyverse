import React, {ReactNode} from 'react'
import axios from 'axios'

export type User = unknown

export interface UserState {
  user: User | null
  loading: boolean
}

export interface UserProviderProps {
  value: UserState
  children: ReactNode
}

// Use a global to save the user, so we don't have to fetch it again after page navigations
let userState: User | null

const User = React.createContext<UserState>({user: null, loading: false})

export const fetchUser = async () => {
  if (userState !== undefined) {
    return userState
  }

  try {
    const {data} = await axios.get<UserState>('/api/user')
    userState = data
  } catch (error) {
    if (error.response.status !== 401) {
      throw error
    }
  }

  return userState
}

export const UserProvider = ({value, children}: UserProviderProps) => {
  const {user} = value

  // If the user was fetched in SSR add it to userState so we don't fetch it again
  React.useEffect(() => {
    if (!userState && user) {
      userState = user
    }
  }, [])

  return <User.Provider value={value}>{children}</User.Provider>
}

export const useUser = () => React.useContext(User)

export const useFetchUser = () => {
  const [data, setUser] = React.useState<UserState>({
    user: userState || null,
    loading: userState === undefined,
  })

  React.useEffect(() => {
    if (userState !== undefined) {
      return
    }

    let isMounted = true

    fetchUser().then((user) => {
      // Only set the user if the component is still mounted
      if (isMounted) {
        setUser({user, loading: false})
      }
    })

    return () => {
      isMounted = false
    }
  }, [userState])

  return data
}
