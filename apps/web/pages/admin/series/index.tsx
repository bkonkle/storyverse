import clsx from 'clsx'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import Admin from '@storyverse/components/layouts/Admin'
import {api} from '@storyverse/graphql/ApiClient'

export function SeriesPage() {
  return (
    <Admin>
      <Head>
        <title>Storyverse - Series</title>
      </Head>
      <div className={clsx('flex', 'flex-wrap')}>
        <div className={clsx('w-full', 'lg:w-8/12', 'px-4')}></div>
        <div className={clsx('w-full', 'lg:w-4/12', 'px-4')}></div>
      </div>
    </Admin>
  )
}

export default withUrqlClient(api, {ssr: true})(SeriesPage)
