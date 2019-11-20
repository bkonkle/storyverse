import React, {FC} from 'react'
import {Provider} from 'urql'

import {client} from '../data/ApiClient'
import CurrentUser from './CurrentUser'
import Layout from './Layout'

interface Props {
  children?: React.ReactNode
}

const App: FC<Props> = ({children}) => {
  return (
    <Provider value={client}>
      <CurrentUser.Provider>
        <Layout>{children}</Layout>
      </CurrentUser.Provider>
    </Provider>
  )
}

export default App
