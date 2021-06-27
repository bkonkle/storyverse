import clsx from 'clsx'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import Admin from '@storyverse/web/components/layouts/Admin'
import {List} from '@storyverse/web/components/admin/sections/stories'
import {Schema, Client} from '@storyverse/graphql'

export function StoriesPage() {
  const [{data: storiesData}] = Schema.useGetMyStoriesQuery()
  const stories = storiesData?.getMyStories.data || []

  return (
    <Admin>
      <Head>
        <title>Storyverse - Stories</title>
      </Head>
      <div className={clsx('flex', 'flex-wrap')}>
        <div className={clsx('w-full', 'lg:w-12/12', 'px-4')}>
          <List stories={stories} />
        </div>
      </div>
    </Admin>
  )
}

export default withUrqlClient(Client.getConfig, {ssr: true})(StoriesPage)
