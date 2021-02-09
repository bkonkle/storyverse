import React, {ReactNode} from 'react'
import Head from 'next/head'

import Navigation from './nav/Navigation'

export const siteTitle = 'Storyverse'

export const Layout = ({children}: {children: ReactNode}) => {
  return (
    <div className="relative bg-white">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="A collaborative storytelling app. Create a story universe, invite friends to contribute stories, and follow your favorites!"
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Navigation />
      <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
        {children}
      </main>
    </div>
  )
}

export default Layout
