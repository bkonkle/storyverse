import React, {useEffect} from 'react'
import Head from 'next/head'

import App from '../components/App'
import Home from '../components/home/Home'
import {Pages, useStore} from '../data/Store'
import PageHeader from '../components/page/PageHeader'
import PageContent from '../components/page/PageContent'

export const HomePage = () => {
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(Pages.Home)
  }, [])

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

export default HomePage
