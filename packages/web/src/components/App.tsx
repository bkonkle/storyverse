import React from 'react'
import {createClient, Provider, dedupExchange, fetchExchange} from 'urql'
import {cacheExchange} from '@urql/exchange-graphcache'
import fetch from 'isomorphic-fetch'

interface Props {
  children?: React.ReactNode
}

const client = createClient({
  url: 'http://localhost:4000',
  fetch,
  exchanges: [dedupExchange, cacheExchange(), fetchExchange],
})

const App = ({children}: Props) => (
  <Provider value={client}>{children}</Provider>
)

export default App
