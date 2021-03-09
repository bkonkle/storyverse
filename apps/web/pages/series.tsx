import React, {useEffect} from 'react'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import App from '../components/App'
import Series from '../components/series/Series'
import {api} from '../data/ApiClient'
import {Pages, useStore} from '../data/Store'
import PageHeader from '../components/page/PageHeader'
import PageContent from '../components/page/PageContent'

export const SeriesPage = () => {
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(Pages.Series)
  }, [setPage])

  return (
    <App requireUser>
      <Head>
        <title>Storyverse - Series</title>
      </Head>
      <PageHeader>Series</PageHeader>
      <PageContent>
        <Series />
      </PageContent>
    </App>
  )
}

export default withUrqlClient(api, {ssr: true})(SeriesPage)
