import React, {useEffect} from 'react'
import clsx from 'clsx'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import Admin from '@storyverse/components/layouts/Admin'
import {Pages, useStore} from '@storyverse/graphql/Store'
import {api} from '@storyverse/graphql/ApiClient'

export function CreateUniversePage() {
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(Pages.Universes)
  }, [setPage])

  return (
    <Admin>
      <Head>
        <title>Storyverse - Create Universe</title>
      </Head>
      <div className={clsx('flex', 'flex-wrap')}>
        <div className={clsx('w-full', 'lg:w-8/12', 'px-4')}></div>
        <div className={clsx('w-full', 'lg:w-4/12', 'px-4')}></div>
      </div>
    </Admin>
  )
}

export default withUrqlClient(api, {ssr: true})(CreateUniversePage)
