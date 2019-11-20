import React from 'react'

import App from '../components/App'
import SEO from '../components/Seo'

const NotFoundPage = () => (
  <App>
    <SEO title="404: Not found" />
    <h1>NOT FOUND</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </App>
)

export default NotFoundPage
