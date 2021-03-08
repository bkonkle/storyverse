import React, {ReactNode} from 'react'

import {useInitUser} from '../data/User'

import Layout from './Layout'

export interface AppProps {
  requireUser?: boolean
  children: ReactNode
}
export const App = (props: AppProps) => {
  const {children, requireUser} = props
  const {user, loading} = useInitUser({requireUser})

  if (requireUser) {
    if (loading || !user) {
      return <Layout />
    }
  }

  return <Layout>{children}</Layout>
}

export default App
