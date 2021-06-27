import {MouseEventHandler, useEffect} from 'react'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'
import {signIn} from 'next-auth/client'

import {Admin} from '@storyverse/web/components/layouts'
import {Client} from '@storyverse/graphql'
import {useInitUser} from '@storyverse/graphql/User'
import {Pages, useStore} from '@storyverse/graphql/Store'

export const handleLogin: MouseEventHandler<HTMLButtonElement> = (event) => {
  event.stopPropagation()
  event.nativeEvent.stopImmediatePropagation()

  signIn('auth0')
}

export const Index = () => {
  const {setPage} = useStore((state) => state.pages)
  const {user, loading} = useInitUser()

  useEffect(() => {
    setPage(Pages.Home)
  }, [setPage])

  return (
    <Admin>
      <Head>
        <title>Storyverse</title>
      </Head>

      {!loading && !user && <button onClick={handleLogin}>Login</button>}
    </Admin>
  )
}

export default withUrqlClient(Client.getConfig, {ssr: true})(Index)
