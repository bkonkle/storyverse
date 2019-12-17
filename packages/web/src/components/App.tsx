import React, {FC} from 'react'
import {Provider} from 'urql'
import primary from '@material-ui/core/colors/blue'
import {ThemeProvider, createMuiTheme} from '@material-ui/core/styles'

import {client} from '../data/ApiClient'
import Layout from './Layout'

const theme = createMuiTheme({
  palette: {primary},
})

interface Props {
  children?: React.ReactNode
}

const App: FC<Props> = ({children}) => {
  return (
    <Provider value={client}>
      <ThemeProvider theme={theme}>
        <Layout>{children}</Layout>
      </ThemeProvider>
    </Provider>
  )
}

export default App
