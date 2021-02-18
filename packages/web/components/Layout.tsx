import React, {ReactNode} from 'react'
import Head from 'next/head'
import clsx from 'clsx'

import Navigation from './nav/Navigation'
import {Pages} from './nav/NavLinks'

export interface LayoutProps {
  children?: ReactNode
  currentPage?: Pages
}

export const siteTitle = 'Storyverse'

export const getClasses = () => {
  return {
    page: clsx('bg-gray-100'),
  }
}

export const Layout = (props: LayoutProps) => {
  const {children, currentPage} = props
  const classes = getClasses()

  return (
    <div className={classes.page}>
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

      <Navigation currentPage={currentPage} />

      <main>{children}</main>
    </div>
  )
}

export default Layout
