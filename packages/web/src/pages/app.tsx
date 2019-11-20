import React, {useEffect} from 'react'
import {navigate} from 'gatsby'

import {useAuth0} from '../data/AuthClient'
import {useGetCurrentUserMutation} from '../data/Schema'
import Layout from '../components/Layout'
import SEO from '../components/Seo'

const RedirectLogin = () => {
  const {isAuthenticated} = useAuth0()
  const [{data}, getCurrentUser] = useGetCurrentUserMutation()

  useEffect(() => {
    if (isAuthenticated) {
      getCurrentUser({input: {}}).catch(err => {
        throw err
      })
    }

    if (!isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated])

  return null
}

const SecondPage = () => {
  return (
    <Layout>
      <SEO title="App" />
      <RedirectLogin />
      <h1>Hi from the App!</h1>
      <p>Welcome to the App!</p>
    </Layout>
  )
}

export default SecondPage
