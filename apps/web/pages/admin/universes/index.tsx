import clsx from 'clsx'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import Admin from '@storyverse/components/layouts/Admin'
import UniversesTable from '@storyverse/components/admin/sections/universes/UniversesTable'
import {getConfig} from '@storyverse/graphql'

export function UniversesPage() {
  return (
    <Admin>
      <Head>
        <title>Storyverse - Universes</title>
      </Head>
      <div className={clsx('flex', 'flex-wrap')}>
        <div className={clsx('w-full', 'lg:w-12/12', 'px-4')}>
          <UniversesTable />
        </div>
      </div>
    </Admin>
  )
}

export default withUrqlClient(getConfig, {ssr: true})(UniversesPage)
