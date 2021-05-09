import clsx from 'clsx'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'
import {useRouter} from 'next/router'

import Admin from '@storyverse/components/layouts/Admin'
import {
  UpdateForm,
  Preview,
} from '@storyverse/components/admin/sections/universes'
import {Schema, getConfig} from '@storyverse/graphql'

export function CreateUniversePage() {
  const {query} = useRouter()
  const id = Array.isArray(query.id) ? query.id.join('') : query.id

  const [data] = Schema.useGetUniverseQuery({
    variables: {id: id ? id.toUpperCase() : ''},
    pause: !id,
  })
  const universe = data.data?.getUniverse || undefined

  if (!id) {
    // TODO: <NotFound />
    return null
  }

  return (
    <Admin>
      <Head>
        <title>Storyverse - Create Universe</title>
      </Head>
      <div className={clsx('flex', 'flex-wrap')}>
        <div className={clsx('w-full', 'lg:w-8/12', 'px-4')}>
          {!data.fetching && <UpdateForm universe={universe} />}
        </div>
        <div className={clsx('w-full', 'lg:w-4/12', 'px-4')}>
          <Preview universe={universe} />
        </div>
      </div>
    </Admin>
  )
}

export default withUrqlClient(getConfig, {ssr: true})(CreateUniversePage)
