import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import Admin from '@storyverse/web/components/layouts/Admin'
import {ProfileSection} from '@storyverse/web/components/admin/sections/user'
import {Client} from '@storyverse/graphql'

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

export default withUrqlClient(Client.getConfig, {ssr: true})(UserProfilePage)
