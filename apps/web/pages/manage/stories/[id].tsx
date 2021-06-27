import clsx from 'clsx'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'
import {useRouter} from 'next/router'

import Admin from '@storyverse/web/components/layouts/Admin'
import {
  UpdateForm,
  Preview,
} from '@storyverse/web/components/admin/sections/stories'
import {Schema, Client} from '@storyverse/graphql'

export function CreateStoryPage() {
  const {query} = useRouter()
  const id = Array.isArray(query.id) ? query.id.join('') : query.id

  const [data] = Schema.useGetStoryQuery({
    variables: {id: id ? id.toUpperCase() : ''},
    pause: !id,
  })
  const story = data.data?.getStory || undefined

  if (!id) {
    // TODO: <NotFound />
    return null
  }

  return (
    <Admin>
      <Head>
        <title>Storyverse - Create Story</title>
      </Head>
      <div className={clsx('flex', 'flex-wrap')}>
        <div className={clsx('w-full', 'lg:w-8/12', 'px-4')}>
          {!data.fetching && <UpdateForm story={story} />}
        </div>
        <div className={clsx('w-full', 'lg:w-4/12', 'px-4')}>
          <Preview story={story} />
        </div>
      </div>
    </Admin>
  )
}

export default withUrqlClient(Client.getConfig, {ssr: true})(CreateStoryPage)
