import React, {useEffect} from 'react'
import {navigate} from 'gatsby'

import {isAuthenticated, handleAuthentication} from '../data/AuthClient'
import App from '../components/App'
import SEO from '../components/Seo'
import Hero from '../components/welcome/Hero'
import Footer from '../components/welcome/Footer'

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
      <SEO title="Welcome" />
      <Hero />
      <Footer />
    </App>
  )
}

export default IndexPage
