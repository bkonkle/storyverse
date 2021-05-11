import {Schema} from '@storyverse/graphql'

import {ImageHeaderSidebar} from '../../sidebars'

export interface PreviewProps {
  series?: Schema.SeriesDataFragment
}

export default function Preview({series}: PreviewProps) {
  return (
    <ImageHeaderSidebar
      alt={series?.name || '...'}
      src={
        series?.picture ||
        'https://cdn.mos.cms.futurecdn.net/rwow8CCG3C3GrqHGiK8qcJ-970-80.jpg.webp'
      }
      stats={[
        {name: 'Stories', value: '20'},
        {name: 'Authors', value: '3'},
        {name: 'Readers', value: '794'},
      ]}
    >
      <div className="mb-2">TEST</div>
      <div className="mb-2">TEST</div>
    </ImageHeaderSidebar>
  )
}
