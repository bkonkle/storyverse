import React, {useEffect} from 'react'
import clsx from 'clsx'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import App from '@storyverse/components/layouts/App'
import CardSettings from '@storyverse/components/cards/CardSettings'
import CardProfile from '@storyverse/components/cards/profile/CardProfile'
import {Pages, useStore} from '@storyverse/graphql/Store'
import {api} from '@storyverse/graphql/ApiClient'

export function UserProfilePage() {
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(Pages.User)
  }, [setPage])

  return (
    <App>
      <Head>
        <title>Storyverse - User Profile</title>
      </Head>
      <div className={clsx('flex', 'flex-wrap')}>
        <div className={clsx('w-full', 'lg:w-8/12', 'px-4')}>
          <CardSettings />
        </div>
        <div className={clsx('w-full', 'lg:w-4/12', 'px-4')}>
          <CardProfile />
        </div>
      </div>
    </App>
  )
}

export default withUrqlClient(api, {ssr: true})(UserProfilePage)
