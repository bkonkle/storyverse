import clsx from 'clsx'

import {useGetCurrentUserQuery} from '@storyverse/graphql/Schema'

import RightSidebar from '../../sidebars/right/RightSidebar'
import ProfilePreviewStat from './ProfilePreviewStat'

export default function ProfilePreview() {
  const [{data}] = useGetCurrentUserQuery()

  const profile = data?.getCurrentUser?.profile

  return (
    <RightSidebar>
      <div className="flex flex-wrap justify-center">
        <div className="w-full px-4 flex justify-center">
          <div className="relative">
            <img
              alt={profile?.displayName || profile?.id || '...'}
              src="https://demos.creative-tim.com/notus-nextjs/img/team-2-800x800.jpg"
              className={clsx(
                'shadow-xl',
                'rounded-full',
                'h-auto',
                'align-middle',
                'border-none',
                'absolute',
                '-m-16',
                '-ml-20',
                'lg:-ml-16',
                'max-w-150-px'
              )}
            />
          </div>
        </div>
        <div className="w-full px-4 text-center mt-20">
          <div className="flex justify-center py-4 lg:pt-4 pt-8">
            <ProfilePreviewStat name="Stories" value="10" />
            <ProfilePreviewStat name="Friends" value="22" />
            <ProfilePreviewStat name="Comments" value="89" />
          </div>
        </div>
      </div>

      <div className="text-center mt-12 pb-10">
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
      </div>
    </RightSidebar>
  )
}
