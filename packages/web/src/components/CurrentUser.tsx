import React, {FC, useEffect, useState} from 'react'
import {navigate} from 'gatsby'

import {isAuthenticated} from '../data/AuthClient'
import {CurrentUserFragment, useGetCurrentUserMutation} from '../data/Schema'

export const Context = React.createContext<CurrentUserFragment | undefined>(
  undefined
)

export const Provider: FC = ({children}) => {
  const [currentUser, setCurrentUser] = useState()
  const [{data}, getCurrentUser] = useGetCurrentUserMutation()

  useEffect(() => {
    if (isAuthenticated()) {
      getCurrentUser({input: {}}).catch(err => {
        throw err
      })

      return
    }

    navigate('/')
  }, [])

  useEffect(() => {
    if (data && data.getCurrentUser && data.getCurrentUser.user) {
      setCurrentUser(data.getCurrentUser.user)
    }
  }, [data])

  return <Context.Provider value={currentUser}>{children}</Context.Provider>
}

export default {Context, Provider}
