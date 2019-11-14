import React, {FC} from 'react'
import {createClient, Provider, dedupExchange, fetchExchange} from 'urql'
import {cacheExchange} from '@urql/exchange-graphcache'
import fetch from 'isomorphic-fetch'
import {Auth0Provider} from '../data/AuthClient'

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

const App: FC<Props> = ({children}) => (
  <Auth0Provider
    redirect_uri={window.location.origin}
    client_id={process.env.GATSBY_AUTH0_CLIENT_ID || ''}
    domain={process.env.GATSBY_AUTH0_DOMAIN || ''}
  >
    <Provider value={client}>{children}</Provider>
  </Auth0Provider>
)

export default App
