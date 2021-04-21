import React, {useEffect} from 'react'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import Deprecated from '@storyverse/components/layouts/Deprecated'
import Home from '@storyverse/components/home/Home'
import PageHeader from '@storyverse/components/page/PageHeader'
import PageContent from '@storyverse/components/page/PageContent'
import {api} from '@storyverse/graphql/ApiClient'
import {Pages, useStore} from '@storyverse/graphql/Store'

export const HomePage = () => {
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(Pages.Home)
  }, [setPage])

  return (
    <Deprecated requireUser>
      <Head>
        <title>Storyverse - Home</title>
      </Head>
      <PageHeader>Home</PageHeader>
      <PageContent>
        <Home />
      </PageContent>
    </Deprecated>
  )
}

export default withUrqlClient(api, {ssr: true})(HomePage)
