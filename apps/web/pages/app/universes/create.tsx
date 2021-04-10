import React, {useEffect} from 'react'
import clsx from 'clsx'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import App from '../../../components/layouts/App'
import CardSettings from '../../../components/cards/CardSettings'
import CardProfile from '../../../components/cards/CardProfile'
import {Pages, useStore} from '../../../data/Store'
import {api} from '../../../data/ApiClient'

export function CreateUniversePage() {
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(Pages.Universes)
  }, [setPage])

  return (
    <App>
      <Head>
        <title>Storyverse - Create Universe</title>
      </Head>
      <div className={clsx('flex', 'flex-wrap')}>
        <div className={clsx('w-full', 'lg:w-8/12', 'px-4')}>
          <CardSettings />
        </div>
        <div className={clsx('w-full', 'lg:w-4/12', 'px-4')}>
          <CardProfile />
        </div>
      </div>
    </App>
  )
}

export default withUrqlClient(api, {ssr: true})(CreateUniversePage)
