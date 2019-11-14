import React from 'react'
import {Link} from 'gatsby'

import Layout from '../components/Layout'
import SEO from '../components/Seo'

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <Link to="/app/">Go to App</Link>
  </Layout>
)

export default IndexPage
