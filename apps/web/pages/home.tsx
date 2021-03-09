import React, {useEffect} from 'react'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import App from '../components/App'
import Home from '../components/home/Home'
import {Pages, useStore} from '../data/Store'
import PageHeader from '../components/page/PageHeader'
import PageContent from '../components/page/PageContent'
import {api} from '../data/ApiClient'

export const HomePage = () => {
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(Pages.Home)
  }, [setPage])

  return (
    <App requireUser>
      <Head>
        <title>Storyverse - Home</title>
      </Head>
      <PageHeader>Home</PageHeader>
      <PageContent>
        <Home />
      </PageContent>
    </App>
  )
}

export default withUrqlClient(api, {ssr: true})(HomePage)
