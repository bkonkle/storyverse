import Head from 'next/head'
import {withUrqlClient} from 'next-urql'
import {useRouter} from 'next/router'

import Play from '@storyverse/web/components/layouts/Play'
import {Story} from '@storyverse/web/components/play'
import {Schema, Client} from '@storyverse/graphql'

export function PlayStoryPage() {
  const {query} = useRouter()
  const id = Array.isArray(query.storyId) ? query.storyId[0] : query.storyId

  const [{data}] = Schema.useGetStoryQuery({
    variables: {id: id ? id.toUpperCase() : ''},
    pause: !id,
  })
  const story = data?.getStory || undefined

  return (
    <Play>
      <Head>
        <title>Play a Story</title>
      </Head>
      <Story story={story} />
    </Play>
  )
}

export default withUrqlClient(Client.getConfig, {ssr: true})(PlayStoryPage)
