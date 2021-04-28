import {ImageHeaderSidebar} from '../../sidebars'

export default function UniversePreview() {
  return (
    <ImageHeaderSidebar
      alt="..."
      src="https://cdn.mos.cms.futurecdn.net/rwow8CCG3C3GrqHGiK8qcJ-970-80.jpg.webp"
      stats={[
        {name: 'Series', value: '10'},
        {name: 'Stories', value: '20'},
        {name: 'Authors', value: '89'},
      ]}
    >
      <div className="mb-2">TEST</div>
      <div className="mb-2">TEST</div>
    </ImageHeaderSidebar>
  )
}
