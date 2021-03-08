import React, {ReactNode, useEffect} from 'react'
import {useRouter} from 'next/router'
import {useSession} from 'next-auth/client'

import Layout from './Layout'
import {useCreateUserMutation, useGetCurrentUserQuery} from '../data/Schema'

export interface AppProps {
  requireUser?: boolean
  children: ReactNode
}

export const App = (props: AppProps) => {
  const {children, requireUser} = props
  const [session, loading] = useSession()
  const [{fetching, data, error}, getCurrentUser] = useGetCurrentUserQuery()
  const [{fetching: createUserFetching}, createUser] = useCreateUserMutation()
  const router = useRouter()

  const user = data?.getCurrentUser

  if (error) {
    console.log(`>- error ->`, error)
  }

  useEffect(() => {
    if (requireUser && !loading && !session) {
      console.log('>- login redirect -<')
      router.push('/')

      return
    }

    if (session) {
      console.log(`>- session ->`, session)
      getCurrentUser()
    }
  }, [loading, session, requireUser, router, getCurrentUser])

  useEffect(() => {
    if (user && !fetching && !createUserFetching && !data?.getCurrentUser) {
      // Create a user, because one doesn't exist yet
      console.log(`>- TODO -> Create a user, because one doesn't exist yet`)
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
