import React, {FC} from 'react'
import {Provider} from 'urql'

import {client} from '../data/ApiClient'
import Layout from './Layout'

interface Props {
  children?: React.ReactNode
}

const App: FC<Props> = ({children}) => (
  <Provider value={client}>
    <Layout>{children}</Layout>
  </Provider>
)

export default App
