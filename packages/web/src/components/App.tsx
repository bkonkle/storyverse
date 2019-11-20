import React, {FC} from 'react'
import {createClient, Provider, dedupExchange, fetchExchange} from 'urql'
import {cacheExchange} from '@urql/exchange-graphcache'
import fetch from 'isomorphic-fetch'

import schema from '../../../../schema.json'
import {Auth0Provider} from '../data/AuthClient'

interface Props {
  children?: React.ReactNode
}

const client = createClient({
  url:
    process.env.GATSBY_API_URL ||
    'https://storyverse-prod-api.konkle.us/graphql',
  fetch,
  fetchOptions: () => {
    if (typeof localStorage !== 'undefined') {
      return {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('test')}`,
        },
      }
    }

    return {}
  },
  exchanges: [
    dedupExchange,
    cacheExchange({schema: schema.data}),
    fetchExchange,
  ],
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
