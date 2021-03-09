import React, {useEffect} from 'react'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import App from '../../components/App'
import Universes from '../../components/universes/Universes'
import {api} from '../../data/ApiClient'
import {Pages, useStore} from '../../data/Store'
import PageHeader from '../../components/page/PageHeader'
import PageContent from '../../components/page/PageContent'

export const UniversesPage = () => {
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(Pages.Universes)
  }, [setPage])

  return (
    <App>
      <Head>
        <title>Storyverse - Universes</title>
      </Head>
      <PageHeader>Universes</PageHeader>
      <PageContent>
        <Universes />
      </PageContent>
    </App>
  )
}

export default withUrqlClient(api, {ssr: true})(UniversesPage)
