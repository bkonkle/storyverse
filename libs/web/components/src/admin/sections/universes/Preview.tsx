import {Schema} from '@storyverse/graphql'

import {ImageHeaderSidebar} from '../../sidebars'

export interface PreviewProps {
  universe?: Schema.UniverseDataFragment
}

export default function Preview({universe}: PreviewProps) {
  return (
    <ImageHeaderSidebar
      alt={universe?.name || '...'}
      src={
        universe?.picture ||
        'https://cdn.mos.cms.futurecdn.net/rwow8CCG3C3GrqHGiK8qcJ-970-80.jpg.webp'
      }
      stats={[
        {name: 'Series', value: '10'},
        {name: 'Stories', value: '20'},
        {name: 'Authors', value: '3'},
      ]}
    >
      <div className="mb-2">TEST</div>
      <div className="mb-2">TEST</div>
    </ImageHeaderSidebar>
  )
}
