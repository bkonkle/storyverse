import clsx from 'clsx'

import {Schema} from '@storyverse/graphql'

import UniverseUpdate from './UniverseUpdate'
import UniversePreview from './UniversePreview'

export interface UniverseUpdateSectionProps {
  id: string
}

export default function UniverseUpdateSection({
  id,
}: UniverseUpdateSectionProps) {
  const [data] = Schema.useGetUniverseQuery({
    variables: {id: id ? id.toUpperCase() : ''},
    pause: !id,
  })
  const universe = data.data?.getUniverse || undefined

  return (
    <div className={clsx('flex', 'flex-wrap')}>
      <div className={clsx('w-full', 'lg:w-8/12', 'px-4')}>
        {!data.fetching && <UniverseUpdate universe={universe} />}
      </div>
      <div className={clsx('w-full', 'lg:w-4/12', 'px-4')}>
        <UniversePreview universe={universe} />
      </div>
    </div>
  )
}
