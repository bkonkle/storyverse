import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import Admin from '@storyverse/components/layouts/Admin'
import {ProfileSection} from '@storyverse/components/admin/sections/user'
import {getConfig} from '@storyverse/graphql'

export function UserProfilePage() {
  return (
    <Admin>
      <Head>
        <title>Storyverse - User Profile</title>
      </Head>
      <ProfileSection />
    </Admin>
  )
}

export default withUrqlClient(getConfig, {ssr: true})(UserProfilePage)
