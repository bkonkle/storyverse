import React, {ReactNode} from 'react'
import Head from 'next/head'
import clsx from 'clsx'

import {useInitUser} from '@storyverse/shared/data/User'
import Navigation from '../nav/Navigation'

export interface AppProps {
  requireUser?: boolean
  children: ReactNode
}

export const App = (props: AppProps) => {
  const {children, requireUser} = props
  const {user, loading} = useInitUser({requireUser})

  return (
    <div className={clsx('bg-gray-100')}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="A collaborative storytelling app. Create a story universe, invite friends to contribute stories, and follow your favorites!"
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            'Storyverse'
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content="Storyverse" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <Navigation />

      <main>{(requireUser && loading) || !user ? null : children}</main>
    </div>
  )
}

export default App
