import clsx from 'clsx'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import {Admin} from '@storyverse/components/layouts'
import {List} from '@storyverse/components/admin/sections/universes'
import {Schema, getConfig} from '@storyverse/graphql'

export function UniversesPage() {
  const [{data: userData}] = Schema.useGetCurrentUserQuery()
  const user = userData?.getCurrentUser
  const profile = user?.profile

  const [{data: universeData}] = Schema.useGetMyUniversesQuery({
    variables: {profileId: profile?.id || ''},
    pause: !profile,
  })
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

export default withUrqlClient(getConfig, {ssr: true})(UniversesPage)
