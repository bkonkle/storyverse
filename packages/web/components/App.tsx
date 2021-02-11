import React, {ReactNode, useEffect} from 'react'
import {useRouter} from 'next/router'

import {UserProvider, useFetchUser} from '../data/UserData'
import Layout from './Layout'

export interface AppProps {
  requireUser?: boolean
  children: ReactNode
}

export const App = (props: AppProps) => {
  const {children, requireUser} = props
  const {user, loading} = useFetchUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user && requireUser) {
      router.push('/')
    }
  }, [loading, user, requireUser])

  if ((loading && requireUser) || (!loading && !user && requireUser)) {
    return <Layout />
  }

  return (
    <UserProvider value={{user, loading}}>
      <Layout>{children}</Layout>
    </UserProvider>
  )
}

export default App
