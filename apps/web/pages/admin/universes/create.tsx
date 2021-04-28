import clsx from 'clsx'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import Admin from '@storyverse/components/layouts/Admin'
import {
  UniverseUpdate,
  UniversePreview,
} from '@storyverse/components/admin/sections/universes'
import {getConfig} from '@storyverse/graphql'

export function CreateUniversePage() {
  return (
    <Admin>
      <Head>
        <title>Storyverse - Create Universe</title>
      </Head>
      <div className={clsx('flex', 'flex-wrap')}>
        <div className={clsx('w-full', 'lg:w-8/12', 'px-4')}>
          <UniverseUpdate />
        </div>
        <div className={clsx('w-full', 'lg:w-4/12', 'px-4')}>
          <UniversePreview />
        </div>
      </div>
    </Admin>
  )
}

export default withUrqlClient(getConfig, {ssr: true})(CreateUniversePage)
