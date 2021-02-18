import React, {ReactNode, useEffect} from 'react'
import {useRouter} from 'next/router'

import {UserProvider, useFetchUser} from '../data/UserData'
import {Pages} from './nav/NavLinks'
import Layout from './Layout'

export interface AppProps {
  requireUser?: boolean
  children: ReactNode
  currentPage?: Pages
}

export const App = (props: AppProps) => {
  const {children, requireUser, currentPage} = props
  const {user, loading} = useFetchUser()
  const router = useRouter()

  useEffect(() => {
    if (requireUser && !loading && !user) {
      router.push('/')
    }
  }, [loading, user, requireUser])

  if (requireUser) {
    if (loading || !user) {
      return <Layout currentPage={currentPage} />
    }
  }

  return (
    <UserProvider value={{user, loading}}>
      <Layout currentPage={currentPage}>{children}</Layout>
    </UserProvider>
  )
}

export default App
