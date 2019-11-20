import React, {useEffect} from 'react'
import {navigate} from 'gatsby'

import {isAuthenticated} from '../data/AuthClient'
import {useGetCurrentUserMutation} from '../data/Schema'
import App from '../components/App'
import SEO from '../components/Seo'

const RedirectLogin = () => {
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

  console.log(`>- data ->`, data)

  return null
}

const SecondPage = () => {
  return (
    <App>
      <SEO title="App" />
      <RedirectLogin />
      <h1>Hi from the App!</h1>
      <p>Welcome to the App!</p>
    </App>
  )
}

export default SecondPage
