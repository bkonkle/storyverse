import React from 'react'
import {createClient, Provider, dedupExchange, fetchExchange} from 'urql'
import {cacheExchange} from '@urql/exchange-graphcache'
import fetch from 'isomorphic-fetch'

interface Props {
  children?: React.ReactNode
}

const client = createClient({
  url:
    process.env.GATSBY_API_URL ||
    'https://storyverse-prod-api.konkle.us/graphql',
  fetch,
  exchanges: [dedupExchange, cacheExchange(), fetchExchange],
})

const App = ({children}: Props) => (
  <Provider value={client}>{children}</Provider>
)

export default App
