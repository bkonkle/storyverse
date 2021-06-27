import clsx from 'clsx'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import Admin from '@storyverse/web/components/layouts/Admin'
import {Client} from '@storyverse/graphql'

export function AdminPage() {
  return (
    <Admin>
      <Head>
        <title>Storyverse - Admin</title>
      </Head>
      <div className={clsx('flex', 'flex-wrap')}>
        <div className={clsx('w-full', 'lg:w-8/12', 'px-4')}></div>
        <div className={clsx('w-full', 'lg:w-4/12', 'px-4')}></div>
      </div>
    </Admin>
  )
}

export default withUrqlClient(Client.getConfig, {ssr: true})(AdminPage)
