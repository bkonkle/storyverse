import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import Admin from '@storyverse/components/layouts/Admin'
import {Client} from '@storyverse/graphql'

export function UserSettingsPage() {
  return (
    <Admin>
      <Head>
        <title>Storyverse - User Settings</title>
      </Head>
    </Admin>
  )
}

export default withUrqlClient(Client.getConfig, {ssr: true})(UserSettingsPage)
