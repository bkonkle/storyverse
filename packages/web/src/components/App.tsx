import React, {FC} from 'react'
import {Provider} from 'urql'

import {client} from '../data/ApiClient'

interface Props {
  children?: React.ReactNode
}

const App: FC<Props> = ({children}) => (
  <Provider value={client}>{children}</Provider>
)

export default App
