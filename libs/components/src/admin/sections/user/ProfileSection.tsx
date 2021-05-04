import {useGetCurrentUserQuery} from '@storyverse/graphql/Schema'
import clsx from 'clsx'

import ProfileForm from './ProfileForm'
import ProfilePreview from './ProfilePreview'

export default function ProfileSection() {
  const [{fetching, data}] = useGetCurrentUserQuery()

  const user = data?.getCurrentUser
  const profile = user?.profile

  if (fetching || !(user && profile)) {
    return null
  }

  return (
    <div className={clsx('flex', 'flex-wrap')}>
      <div className={clsx('w-full', 'lg:w-8/12', 'px-4')}>
        <ProfileForm user={user} profile={profile} />
      </div>
      <div className={clsx('w-full', 'lg:w-4/12', 'px-4')}>
        <ProfilePreview profile={profile} />
      </div>
    </div>
  )
}
