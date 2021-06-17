import clsx from 'clsx'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'
import {useRouter} from 'next/router'

import Admin from '@storyverse/components/layouts/Admin'
import {UpdateForm, Preview} from '@storyverse/components/admin/sections/series'
import {Schema, Client} from '@storyverse/graphql'

export function CreateSeriesPage() {
  const {query} = useRouter()
  const id = Array.isArray(query.id) ? query.id.join('') : query.id

  const [data] = Schema.useGetSeriesQuery({
    variables: {id: id ? id.toUpperCase() : ''},
    pause: !id,
  })
  const series = data.data?.getSeries || undefined

  if (!id) {
    // TODO: <NotFound />
    return null
  }

  return (
    <Admin>
      <Head>
        <title>Storyverse - Create Series</title>
      </Head>
      <div className={clsx('flex', 'flex-wrap')}>
        <div className={clsx('w-full', 'lg:w-8/12', 'px-4')}>
          {!data.fetching && <UpdateForm series={series} />}
        </div>
        <div className={clsx('w-full', 'lg:w-4/12', 'px-4')}>
          <Preview series={series} />
        </div>
      </div>
    </Admin>
  )
}

export default withUrqlClient(Client.getConfig, {ssr: true})(CreateSeriesPage)
