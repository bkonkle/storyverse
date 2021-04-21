import React, {useEffect} from 'react'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import Deprecated from '../components/layouts/Deprecated'
import Stories from '../components/stories/Stories'
import {api} from '@storyverse/shared/data/ApiClient'
import {Pages, useStore} from '@storyverse/shared/data/Store'
import PageHeader from '../components/page/PageHeader'
import PageContent from '../components/page/PageContent'

export const StoriesPage = () => {
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(Pages.Stories)
  }, [setPage])

  return (
    <Deprecated requireUser>
      <Head>
        <title>Storyverse - Stories</title>
      </Head>
      <PageHeader>Stories</PageHeader>
      <PageContent>
        <Stories />
      </PageContent>
    </Deprecated>
  )
}

export default withUrqlClient(api, {ssr: true})(StoriesPage)
