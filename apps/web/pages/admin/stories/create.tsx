import clsx from 'clsx'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import Admin from '@storyverse/components/layouts/Admin'
import {
  UpdateForm,
  Preview,
} from '@storyverse/components/admin/sections/stories'
import {Client} from '@storyverse/graphql'

export function CreateStoryPage() {
  return (
    <Admin>
      <Head>
        <title>Storyverse - Create Story</title>
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

export default withUrqlClient(Client.getConfig, {ssr: true})(CreateStoryPage)
