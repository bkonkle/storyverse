import {Schema} from '@storyverse/graphql'

import {ImageHeaderSidebar} from '../../sidebars'

export interface PreviewProps {
  story?: Schema.StoryDataFragment
}

export default function Preview({story}: PreviewProps) {
  return (
    <ImageHeaderSidebar
      alt={story?.name || '...'}
      src={
        story?.picture ||
        'https://cdn.mos.cms.futurecdn.net/rwow8CCG3C3GrqHGiK8qcJ-970-80.jpg.webp'
      }
      stats={[
        {name: 'Readers', value: '21'},
        {name: 'Views', value: '68'},
        {name: 'Comments', value: '3'},
      ]}
    >
      <div className="mb-2">TEST</div>
      <div className="mb-2">TEST</div>
    </ImageHeaderSidebar>
  )
}
