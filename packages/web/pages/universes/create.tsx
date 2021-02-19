import React, {useEffect} from 'react'
import Head from 'next/head'

import App from '../../components/App'
import CreateUniverse from '../../components/universes/CreateUniverse'
import {Pages, useStore} from '../../data/Store'
import PageHeader from '../../components/page/PageHeader'
import PageContent from '../../components/page/PageContent'

export const CreateUniversePage = () => {
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(Pages.Universes)
  }, [])

  return (
    <App requireUser>
      <Head>
        <title>Storyverse - Create Universe</title>
      </Head>
      <PageHeader>Create a Universe</PageHeader>
      <PageContent>
        <CreateUniverse />
      </PageContent>
    </App>
  )
}

export default CreateUniversePage
