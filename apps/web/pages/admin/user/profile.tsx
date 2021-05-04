import clsx from 'clsx'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import {useGetCurrentUserQuery} from '@storyverse/graphql/Schema'
import Admin from '@storyverse/components/layouts/Admin'
import {
  ProfileForm,
  ProfilePreview,
} from '@storyverse/components/admin/sections/user'
import {getConfig} from '@storyverse/graphql'

export function UserProfilePage() {
  const [{fetching, data}] = useGetCurrentUserQuery()

  const user = data?.getCurrentUser
  const profile = user?.profile

  return (
    <Admin>
      <Head>
        <title>Storyverse - User Profile</title>
      </Head>
      {!fetching && user && profile && (
        <div className={clsx('flex', 'flex-wrap')}>
          <div className={clsx('w-full', 'lg:w-8/12', 'px-4')}>
            <ProfileForm user={user} profile={profile} />
          </div>
          <div className={clsx('w-full', 'lg:w-4/12', 'px-4')}>
            <ProfilePreview profile={profile} />
          </div>
        </div>
      )}
    </Admin>
  )
}

export default withUrqlClient(getConfig, {ssr: true})(UserProfilePage)
