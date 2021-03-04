import React, {ReactNode, useEffect} from 'react'
import {useRouter} from 'next/router'

import {useFetchUser} from '../data/User'
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
    if (requireUser && !loading && !user) {
      router.push('/')
    }
  }, [loading, user, requireUser, router])

  if (requireUser) {
    if (loading || !user) {
      return <Layout />
    }
  }

  return <Layout>{children}</Layout>
}

export default App
