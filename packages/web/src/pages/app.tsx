import React from 'react'
import {Link} from 'gatsby'

import Layout from '../components/Layout'
import SEO from '../components/Seo'

const SecondPage = () => (
  <Layout>
    <SEO title="Page two" />
    <h1>Hi from the App!</h1>
    <p>Welcome to the App!</p>
    <Link to="/">Go back to the homepage</Link>
  </Layout>
)

export default SecondPage
