import React, {ReactNode, useEffect} from 'react'
import {useRouter} from 'next/router'
import {useUser} from '@auth0/nextjs-auth0'

import Layout from './Layout'
import {useCreateUserMutation, useGetCurrentUserQuery} from '../data/Schema'

export interface AppProps {
  requireUser?: boolean
  children: ReactNode
}

export const App = (props: AppProps) => {
  const {children, requireUser} = props
  const {user, error, isLoading} = useUser()
  const [{fetching, data}, getCurrentUser] = useGetCurrentUserQuery()
  const [{fetching: createUserFetching}, createUser] = useCreateUserMutation()
  const router = useRouter()

  console.log(`>- error ->`, error)

  console.log(`>- user ->`, user)
  console.log(`>- isLoading ->`, isLoading)
  console.log(`>- fetching ->`, fetching)
  console.log(`>- data ->`, data?.getCurrentUser)

  useEffect(() => {
    if (requireUser && !isLoading && !user) {
      router.push('/')

      return
    }

    if (user) {
      getCurrentUser()
    }
  }, [isLoading, user, requireUser, router, getCurrentUser])

  useEffect(() => {
    if (user && !fetching && !createUserFetching && !data?.getCurrentUser) {
      // Create a user, because one doesn't exist yet
      // createUser({input: {username: user.sub}})
    }
  }, [user, fetching, data, createUser, createUserFetching])

  if (requireUser) {
    if (isLoading || !user) {
      return <Layout />
    }
  }

  return <Layout>{children}</Layout>
}

export default App
