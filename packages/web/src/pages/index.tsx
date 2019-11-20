import React, {useEffect} from 'react'
import {navigate} from 'gatsby'

import {useAuth0} from '../data/AuthClient'
import Layout from '../components/Layout'
import SEO from '../components/Seo'

const RedirectApp = () => {
  const {isAuthenticated} = useAuth0()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app')
    }
  }, [isAuthenticated])

  return null
}

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <RedirectApp />
  </Layout>
)

export default IndexPage
