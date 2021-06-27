import {Schema} from '@storyverse/graphql'

import ProfileForm from './ProfileForm'
import ProfilePreview from './ProfilePreview'

export default function ProfileSection() {
  const [{fetching, data}] = Schema.useGetCurrentUserQuery()

  const user = data?.getCurrentUser
  const profile = user?.profile

  return (
    <div className="flex flex-wrap">
      <div className="w-full lg:w-8/12 px-4">
        {!fetching && user && profile && (
          <ProfileForm user={user} profile={profile} />
        )}
      </div>
      <div className="w-full lg:w-4/12 px-4">
        {!fetching && profile && <ProfilePreview profile={profile} />}
      </div>
    </div>
  )
}
