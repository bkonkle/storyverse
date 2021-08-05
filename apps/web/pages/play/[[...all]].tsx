import Head from 'next/head'
import {withUrqlClient} from 'next-urql'
import {useRouter} from 'next/router'

import Play from '@storyverse/web/components/layouts/Play'
import {Story} from '@storyverse/web/components/play'
import {Schema, Client} from '@storyverse/graphql'

export function PlayStoryPage() {
  const {query} = useRouter()

  // Url formats: /play, /play/story/abc123def456
  const [resource, id] = Array.isArray(query.all) ? query.all : [query.all]

  const [_currentUser] = Schema.useGetCurrentUserQuery()

  const [getStory] = Schema.useGetStoryQuery({
    variables: {id: id ? id.toUpperCase() : ''},
    pause: !(resource === 'story' && id),
  })
  const story = getStory.data?.getStory || undefined

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
