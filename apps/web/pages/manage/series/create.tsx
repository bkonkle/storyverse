import clsx from 'clsx'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import Admin from '@storyverse/web/components/layouts/Admin'
import {
  UpdateForm,
  Preview,
} from '@storyverse/web/components/admin/sections/series'
import {Client} from '@storyverse/graphql'

export function CreateSeriesPage() {
  return (
    <Admin>
      <Head>
        <title>Storyverse - Create Series</title>
      </Head>
      <div className={clsx('flex', 'flex-wrap')}>
        <div className={clsx('w-full', 'lg:w-8/12', 'px-4')}>
          <UpdateForm />
        </div>
        <div className={clsx('w-full', 'lg:w-4/12', 'px-4')}>
          <Preview />
        </div>
      </div>
    </Admin>
  )
}

export default withUrqlClient(Client.getConfig, {ssr: true})(CreateSeriesPage)
