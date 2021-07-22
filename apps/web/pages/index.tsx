import {useEffect} from 'react'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import {Admin} from '@storyverse/web/components/layouts'
import {Client} from '@storyverse/graphql'
import {Pages, useStore} from '@storyverse/graphql/Store'

export const Index = () => {
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(Pages.Home)
  }, [setPage])

  return (
    <Admin>
      <Head>
        <title>Storyverse</title>
      </Head>
    </Admin>
  )
}

export default withUrqlClient(Client.getConfig, {ssr: true})(Index)
