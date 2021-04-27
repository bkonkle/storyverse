import clsx from 'clsx'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import Admin from '@storyverse/components/layouts/Admin'
import ProfileForm from '@storyverse/components/admin/sections/user/ProfileForm'
import ProfilePreview from '@storyverse/components/admin/sections/user/ProfilePreview'
import {getConfig} from '@storyverse/graphql'

export function UserProfilePage() {
  return (
    <Admin>
      <Head>
        <title>Storyverse - User Profile</title>
      </Head>
      <div className={clsx('flex', 'flex-wrap')}>
        <div className={clsx('w-full', 'lg:w-8/12', 'px-4')}>
          <ProfileForm />
        </div>
        <div className={clsx('w-full', 'lg:w-4/12', 'px-4')}>
          <ProfilePreview />
        </div>
      </div>
    </Admin>
  )
}

export default withUrqlClient(getConfig, {ssr: true})(UserProfilePage)
