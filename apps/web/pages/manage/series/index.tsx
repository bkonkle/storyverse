import clsx from 'clsx'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import {Admin} from '@storyverse/components/layouts'
import {List} from '@storyverse/components/admin/sections/series'
import {Schema, Client} from '@storyverse/graphql'

export function SeriesPage() {
  const [{data: seriesData}] = Schema.useGetMySeriesQuery()
  const series = seriesData?.getMySeries.data || []

  return (
    <Admin>
      <Head>
        <title>Storyverse - Series</title>
      </Head>
      <div className={clsx('flex', 'flex-wrap')}>
        <div className={clsx('w-full', 'lg:w-12/12', 'px-4')}>
          <List series={series} />
        </div>
      </div>
    </Admin>
  )
}

export default withUrqlClient(Client.getConfig, {ssr: true})(SeriesPage)
