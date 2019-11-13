import React from 'react'
import {Provider} from 'urql'

import client from '../data/ApiClient'
import Routes from '../Routes'

const App = () => (
  <Provider value={client}>
    <Routes />
  </Provider>
)

export default App
