import React from 'react'
import {Router, Location} from '@reach/router'

import App from '../components/App'
import Welcome from '../routes/Welcome'
import Profile from '../routes/Profile'

const AppPage = () => (
  <App>
    <Location>
      {({location}) => (
        <Router location={location}>
          <Welcome path="/app" />
          <Profile path="/app/profile" />
        </Router>
      )}
    </Location>
  </App>
)

export default AppPage
