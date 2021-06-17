import clsx from 'clsx'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import {Admin} from '@storyverse/components/layouts'
import {List} from '@storyverse/components/admin/sections/universes'
import {Schema, Client} from '@storyverse/graphql'

export function UniversesPage() {
  const [{data: universeData}] = Schema.useGetManyUniversesQuery()
  const universes = universeData?.getManyUniverses.data || []

  return (
    <Admin>
      <Head>
        <title>Storyverse - Universes</title>
      </Head>
      <div className={clsx('flex', 'flex-wrap')}>
        <div className={clsx('w-full', 'lg:w-12/12', 'px-4')}>
          <List universes={universes} />
        </div>
      </div>
    </Admin>
  )
}

export default withUrqlClient(Client.getConfig, {ssr: true})(UniversesPage)
