import React, {ReactNode} from 'react'

import {UserProvider, useFetchUser} from '../data/UserData'
import Layout from './Layout'

export interface AppProps {
  children: ReactNode
}

export const App = (props: AppProps) => {
  const {children} = props
  const {user, loading} = useFetchUser()

  return (
    <UserProvider value={{user, loading}}>
      <Layout>{children}</Layout>
    </UserProvider>
  )
}

export default App
