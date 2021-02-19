import React, {useEffect} from 'react'
import Head from 'next/head'

import App from '../components/App'
import Stories from '../components/stories/Stories'
import {Pages, useStore} from '../data/Store'
import PageHeader from '../components/page/PageHeader'
import PageContent from '../components/page/PageContent'

export const StoriesPage = () => {
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(Pages.Stories)
  }, [])

  return (
    <App requireUser>
      <Head>
        <title>Storyverse - Stories</title>
      </Head>
      <PageHeader>Stories</PageHeader>
      <PageContent>
        <Stories />
      </PageContent>
    </App>
  )
}

export default StoriesPage
