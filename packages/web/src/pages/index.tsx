import React, {useEffect} from 'react'
import {navigate} from 'gatsby'

import {isAuthenticated, handleAuthentication} from '../data/AuthClient'
import App from '../components/App'
import SEO from '../components/Seo'

const IndexPage = () => {
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/app')

      return
    }

    handleAuthentication()
  }, [])

  return (
    <App>
      <SEO title="Home" />
    </App>
  )
}

export default IndexPage
