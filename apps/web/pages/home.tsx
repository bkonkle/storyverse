import React, {useEffect} from 'react'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import Deprecated from '../components/layouts/Deprecated'
import Home from '../components/home/Home'
import {Pages, useStore} from '@storyverse/shared/data/Store'
import PageHeader from '../components/page/PageHeader'
import PageContent from '../components/page/PageContent'
import {api} from '@storyverse/shared/data/ApiClient'

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
