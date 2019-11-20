import React, {useEffect} from 'react'
import {navigate} from 'gatsby'

import {isAuthenticated, handleAuthentication} from '../data/AuthClient'
import Layout from '../components/Layout'
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
    <Layout>
      <SEO title="Home" />
    </Layout>
  )
}

export default IndexPage
