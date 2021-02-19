import React, {useEffect} from 'react'
import Head from 'next/head'

import App from '../../components/App'
import Universes from '../../components/universes/Universes'
import {Pages, useStore} from '../../data/Store'
import PageHeader from '../../components/page/PageHeader'
import PageContent from '../../components/page/PageContent'

export const UniversesPage = () => {
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(Pages.Universes)
  }, [])

  return (
    <App requireUser>
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

export default UniversesPage
