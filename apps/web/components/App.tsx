import React, {ReactNode, useEffect} from 'react'
import {useRouter} from 'next/router'

import Layout from './Layout'
import {useCreateUserMutation, useGetCurrentUserQuery} from '../data/Schema'

export interface AppProps {
  requireUser?: boolean
  children: ReactNode
}

export const App = (props: AppProps) => {
  const {children, requireUser} = props
  const [{fetching, data, error}, getCurrentUser] = useGetCurrentUserQuery()
  const [{fetching: createUserFetching}, createUser] = useCreateUserMutation()
  const router = useRouter()

  const user = data?.getCurrentUser

  console.log(`>- error ->`, error)
  console.log(`>- user ->`, user)
  console.log(`>- fetching ->`, fetching)

  useEffect(() => {
    if (requireUser && !fetching && !user) {
      router.push('/')

      return
    }

    if (user) {
      getCurrentUser()
    }
  }, [fetching, user, requireUser, router, getCurrentUser])

  useEffect(() => {
    if (user && !fetching && !createUserFetching && !data?.getCurrentUser) {
      // Create a user, because one doesn't exist yet
      // createUser({input: {username: user.sub}})
    }
  }, [user, fetching, data, createUser, createUserFetching])

  if (requireUser) {
    if (fetching || !user) {
      return <Layout />
    }
  }

  return <Layout>{children}</Layout>
}

export default App
