import {useGetCurrentUserQuery} from '@storyverse/graphql/Schema'

import {ImageHeaderSidebar} from '../../sidebars'

export default function ProfilePreview() {
  const [{data}] = useGetCurrentUserQuery()

  const profile = data?.getCurrentUser?.profile

  return (
    <ImageHeaderSidebar
      alt={profile?.displayName || profile?.id || '...'}
      src="https://demos.creative-tim.com/notus-nextjs/img/team-2-800x800.jpg"
      stats={[
        {name: 'Stories', value: '10'},
        {name: 'Friends', value: '20'},
        {name: 'Comments', value: '89'},
      ]}
      circle
    >
      <h3 className="text-xl font-semibold leading-normal mb-2 text-blueGray-700">
        {profile?.displayName}
      </h3>
      <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
        <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>{' '}
        Palmer Lake, Colorado
      </div>
      {/*
      <div className="mb-2 text-blueGray-600 mt-10">
        <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
        Solution Manager - Creative Tim Officer
      </div>
      <div className="mb-2 text-blueGray-600">
        <i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>
        University of Computer Science
      </div>
      */}
    </ImageHeaderSidebar>
  )
}
